<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSettings extends Model
{
    protected $table = 'site_settings';

    protected $fillable = ['key', 'value', 'type', 'group', 'label', 'sort'];

    public static function get(string $key, $default = null): mixed
    {
        return Cache::remember("site_setting:{$key}", 3600, function () use ($key, $default) {
            return static::where('key', $key)->value('value') ?? $default;
        });
    }

    public static function group(string $group): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember("site_settings_group:{$group}", 3600, function () use ($group) {
            return static::where('group', $group)->orderBy('sort')->get();
        });
    }

    public static function clearCache(string $key = null): void
    {
        if ($key) {
            Cache::forget("site_setting:{$key}");
        }
        Cache::forget('site_settings_group:about');
        Cache::forget('site_settings_group:contact');
        Cache::forget('site_settings_group:general');
    }
}
