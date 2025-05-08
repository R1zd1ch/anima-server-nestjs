import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { handleError } from 'shared/lib/utils/handle-error';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async createComment(dto: CreateCommentDto, userId: string) {
    try {
      if (dto.parentId) {
        const parent = await this.prismaService.comment.findUnique({
          where: {
            id: dto.parentId,
          },
        });

        if (!parent)
          throw new NotFoundException('Родительский комментарий не найден');
      }

      const comment = await this.prismaService.comment.create({
        data: {
          ...dto,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
          anime: {
            select: {
              id: true,
              russian: true,
              name: true,
              poster: {
                select: { originalUrl: true, mainUrl: true },
              },
            },
          },
        },
      });

      return comment;
    } catch (e) {
      handleError(e, 'Ошибка создания комментария', this.logger);
    }
  }

  public async updateComment(
    id: string,
    dto: UpdateCommentDto,
    userId: string,
  ) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: { id: id },
      });

      if (!comment) throw new NotFoundException('Комментарий не найден');
      if (userId !== comment.userId)
        throw new UnauthorizedException('Вы не создатель комментария');

      return await this.prismaService.comment.update({
        where: { id: comment.id },
        data: {
          ...dto,
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      handleError(e, 'Ошибка обновления комментария', this.logger);
    }
  }

  public async deleteComment(id: string, userId: string) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: { id },
      });

      if (!comment) throw new NotFoundException('Комментарий не найден');
      if (comment.userId !== userId)
        throw new UnauthorizedException('Вы не создатель комментария');

      return await this.prismaService.comment.delete({ where: { id } });
    } catch (e) {
      handleError(e, 'Ошибка удаления комментария', this.logger);
    }
  }

  public async getCommentsByAnime(
    animeId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'top' = 'newest',
    userId?: string,
  ) {
    try {
      const where = { animeId, parentId: null };

      const comments = await this.prismaService.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          sortBy === 'newest' ? { createdAt: 'desc' } : { likesCount: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
          _count: {
            select: { CommentLike: true, replies: true },
          },
        },
      });

      const commentIds = comments.map((comment) => comment.id);
      const userLikesForComments = userId
        ? await this.prismaService.commentLike.findMany({
            where: {
              userId,
              commentId: { in: commentIds },
            },
          })
        : [];
      const commentsWithLikes = comments.map((comment) => {
        const { _count, ...rest } = comment;
        return {
          ...rest,
          isLiked: userLikesForComments.some(
            (like) => like.commentId === comment.id,
          ),
          likesCount: _count.CommentLike,
          repliesCount: _count.replies,
        };
      });

      const total = await this.prismaService.comment.count({ where });

      return {
        data: commentsWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      handleError(e, 'Ошибка получения комментариев', this.logger);
    }
  }

  public async getCommentsByAnimeAndEpisode(
    animeId: string,
    episode: number,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'top' = 'newest',
    userId?: string,
  ) {
    try {
      const where = { animeId, episode, parentId: null };
      const [anime, comments] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({ where: { id: animeId } }),
        this.prismaService.comment.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy:
            sortBy === 'newest'
              ? { createdAt: 'desc' }
              : { likesCount: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                picture: true,
              },
            },
            _count: {
              select: { CommentLike: true, replies: true },
            },
          },
        }),
      ]);

      if (!anime) throw new NotFoundException('Аниме не найдено');

      const commentIds = comments.map((comment) => comment.id);
      const userLikesForComments = userId
        ? await this.prismaService.commentLike.findMany({
            where: {
              userId,
              commentId: { in: commentIds },
            },
          })
        : [];
      const commentsWithLikes = comments.map((comment) => {
        const { _count, ...rest } = comment;
        return {
          ...rest,
          isLiked: userLikesForComments.some(
            (like) => like.commentId === comment.id,
          ),
          likesCount: _count.CommentLike,
          repliesCount: _count.replies,
        };
      });

      const total = await this.prismaService.comment.count({ where });
      return {
        data: commentsWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения комментариев по эпизоду',
        this.logger,
      );
    }
  }

  public async getCommentReplies(
    commentId: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ) {
    try {
      const where = { parentId: commentId };
      const replies = await this.prismaService.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
          _count: {
            select: { CommentLike: true },
          },
        },
      });

      const replyIds = replies.map((reply) => reply.id);
      const userLikesForReplies = userId
        ? await this.prismaService.commentLike.findMany({
            where: {
              userId,
              commentId: { in: replyIds },
            },
          })
        : [];

      const repliesWithLikes = replies.map((reply) => {
        const { _count, ...rest } = reply;
        return {
          ...rest,
          isLiked: userLikesForReplies.some(
            (like) => like.commentId === reply.id,
          ),
          likesCount: _count.CommentLike,
        };
      });

      const total = await this.prismaService.comment.count({ where });

      return {
        data: repliesWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения ответов на комментарий',
        this.logger,
      );
    }
  }

  public async getUserComments(
    userId: string,
    viewerId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'top' = 'newest',
  ) {
    try {
      const isOwner = viewerId === userId;

      if (!isOwner) {
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: {
            settings: {
              select: { showAllCommentsInProfile: true },
            },
          },
        });

        if (!targetUser) throw new NotFoundException('Пользователь не найден');

        if (!targetUser?.settings?.showAllCommentsInProfile) {
          return {
            data: [],
            meta: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
          };
        }
      }

      const where = { userId };

      const comments = await this.prismaService.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          sortBy === 'newest'
            ? { createdAt: 'desc' }
            : { CommentLike: { _count: 'desc' } },
        include: {
          _count: {
            select: { CommentLike: true, replies: true },
          },
          anime: {
            select: {
              id: true,
              russian: true,
              name: true,
            },
            include: {
              poster: {
                select: { originalUrl: true, mainUrl: true },
              },
            },
          },
        },
      });
      const commentsWithLikes = await Promise.all(
        comments.map(async (comment) => {
          const { _count, ...rest } = comment;
          return {
            ...rest,
            isLiked: await this.isCommentLiked(userId, comment.id),
            likesCount: _count.CommentLike,
            repliesCount: _count.replies,
          };
        }),
      );

      const total = await this.prismaService.comment.count({ where });

      return {
        data: commentsWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения комментариев пользователя',
        this.logger,
      );
    }
  }

  public async likeComment(userId: string, commentId: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) throw new NotFoundException('Комментарий не найден');
      const existingLike = await this.isCommentLiked(userId, commentId);
      if (existingLike)
        throw new ConflictException('Вы уже лайкнули этот комментарий');

      await this.prismaService.$transaction([
        this.prismaService.commentLike.create({
          data: { userId, commentId },
        }),
        this.prismaService.comment.update({
          where: { id: commentId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      return { success: true };
    } catch (e) {
      handleError(e, 'Ошибка создания лайка комментария', this.logger);
    }
  }

  public async unlikeComment(userId: string, commentId: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
      });
      if (!comment) throw new NotFoundException('Комментарий не найден');

      const isLiked = await this.isCommentLiked(userId, commentId);
      if (!isLiked)
        throw new ConflictException('Вы не лайкалиы этот комментарий');

      await this.prismaService.$transaction([
        this.prismaService.commentLike.delete({
          where: {
            userId_commentId: { userId, commentId },
          },
        }),
        this.prismaService.comment.update({
          where: { id: commentId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return { success: true };
    } catch (e) {
      handleError(e, 'Ошибка удаления лайка комментария', this.logger);
    }
  }

  public async getUserLikes(
    userId: string,
    viewerId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'oldest' = 'newest',
  ) {
    try {
      const isOwner = userId === viewerId;

      if (!isOwner) {
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: {
            settings: {
              select: { showAllCommentsInProfile: true },
            },
          },
        });

        if (!targetUser?.settings?.showAllCommentsInProfile) {
          return {
            data: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
          };
        }
      }

      const where = { userId };

      const likes = await this.prismaService.commentLike.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          likedAt: sortBy === 'newest' ? 'desc' : 'asc',
        },

        include: {
          comment: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  picture: true,
                },
              },
              anime: {
                select: {
                  id: true,
                  russian: true,
                  name: true,
                  poster: {
                    select: { originalUrl: true, mainUrl: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!likes) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        };
      }

      const total = await this.prismaService.commentLike.count({ where });

      return {
        data: likes.map((like) => ({
          ...like.comment,
          likedAt: like.likedAt,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e: unknown) {
      return handleError(
        e,
        'Ошибка получения страницы лайков пользователя',
        this.logger,
      );
    }
  }

  private async isCommentLiked(userId: string, id: string) {
    try {
      const like = await this.prismaService.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId: id,
          },
        },
      });

      return like ? true : false;
    } catch (e) {
      handleError(e, 'Ошибка проверки лайка комментария', this.logger);
    }
  }
}
