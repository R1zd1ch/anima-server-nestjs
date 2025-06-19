import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({})
export class SupabaseService implements OnModuleInit {
  public constructor(private readonly configService: ConfigService) {}
  private supabase: SupabaseClient;

  onModuleInit() {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_CDN_SERVICE_URL'),
      this.configService.get<string>('SUPABASE_CDN_SERVICE_KEY'),
    );
  }

  public async uploadFile(
    file: Omit<Express.Multer.File, 'buffer' | 'mimetype'> & {
      buffer: Buffer;
      mimetype: string;
    },
    bucketName: string,
    path: string,
  ): Promise<string> {
    console.log(file);
    console.log(bucketName);
    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(path, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    console.log(error);

    if (error) throw new Error(`Ошибка загрузки: ${error.message}`);
    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(path);

    return data.publicUrl;
  }
}
