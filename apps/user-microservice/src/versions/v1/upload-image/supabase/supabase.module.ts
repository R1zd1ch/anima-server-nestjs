import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [SupabaseService],
  providers: [SupabaseService],
})
export class SupabaseModule {}
