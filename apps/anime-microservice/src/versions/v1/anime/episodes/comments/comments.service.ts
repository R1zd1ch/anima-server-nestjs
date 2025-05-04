import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async createComment(dto: CreateCommentDto) {
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
        data: dto,
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
    } catch {
      this.logger.error(`Ошибка создания комментария`);
      throw new InternalServerErrorException('Ошибка создания комментария');
    }
  }

  public async updateComment(id: string, dto: UpdateCommentDto) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: { id },
      });

      if (!comment) throw new NotFoundException('Комментарий не найден');
      if (dto.userId !== comment.userId)
        throw new UnauthorizedException('Вы не создатель комментария');

      return await this.prismaService.comment.update({
        where: { id },
        data: dto,
      });
    } catch {
      this.logger.error(`Ошибка обновления комментария`);
      throw new InternalServerErrorException('Ошибка обновления комментария');
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
    } catch {
      this.logger.error(`Ошибка удаления комментария`);
      throw new InternalServerErrorException('Ошибка удаления комментария');
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
          replies: {
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
          },
          _count: {
            select: { CommentLike: true },
          },
        },
      });

      if (comments.length === 0) {
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

      const commentIds = comments.map((comment) => comment.id);
      const userLikesForComments = userId
        ? await this.prismaService.commentLike.findMany({
            where: {
              userId,
              commentId: { in: commentIds },
            },
          })
        : [];
      const commentsWithLikes = comments.map((comment) => ({
        ...comment,
        isLiked: userLikesForComments.some(
          (like) => like.commentId === comment.id,
        ),
        likesCount: comment._count.CommentLike,
      }));

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
    } catch {
      this.logger.error(`Ошибка получения комментариев`);
      throw new InternalServerErrorException('Ошибка получения комментариев');
    }
  }

  public async getCommentReplies(
    commentId: string,
    page: number = 1,
    limit: number = 10,
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

      if (replies.length === 0) {
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

      const replyIds = replies.map((reply) => reply.id);
      const userLikesForReplies = await this.prismaService.commentLike.findMany(
        {
          where: {
            commentId: { in: replyIds },
          },
        },
      );

      const repliesWithLikes = replies.map((reply) => ({
        ...reply,
        isLiked: userLikesForReplies.some(
          (like) => like.commentId === reply.id,
        ),
        likesCount: reply._count.CommentLike,
      }));

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
    } catch {
      this.logger.error(`Ошибка получения ответов на комментарий`);
      throw new InternalServerErrorException(
        'Ошибка получения ответов на комментарий',
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

        if (!targetUser.settings.showAllCommentsInProfile) {
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
            select: { CommentLike: true },
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

      if (comments.length === 0) {
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

      const commentsWithLikes = await Promise.all(
        comments.map(async (comment) => ({
          ...comment,
          isLiked: await this.isCommentLiked(userId, comment.id),
          likesCount: comment._count.CommentLike,
        })),
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
    } catch {
      this.logger.error(`Ошибка получения комментариев пользователя`);
      throw new InternalServerErrorException(
        'Ошибка получения комментариев пользователя',
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
    } catch {
      this.logger.error(`Ошибка создания лайка комментария`);
      throw new InternalServerErrorException(
        'Ошибка создания лайка комментария',
      );
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
    } catch {
      this.logger.error(`Ошибка удаления лайка комментария`);
      throw new InternalServerErrorException(
        'Ошибка удаления лайка комментария',
      );
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
      this.logger.error(
        `Ошибка получения страницы лайков пользователя: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException(
        'Ошибка получения страницы лайков пользователя',
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
    } catch {
      this.logger.error(`Ошибка проверки лайка комментария`);
      throw new InternalServerErrorException(
        'Ошибка проверки лайка комментария',
      );
    }
  }
}
