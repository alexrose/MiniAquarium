<?php
namespace App\Http\Traits;

use App\Setting;

trait SettingsTrait
{
    public function getBaseUrl()
    {
        $baseURL = env("ESP_ADDRESS");
        $baseSetting = Setting::where("name", "base")->first();

        if ($baseSetting && $baseSetting->name && $baseSetting->value) {
            $baseURL = $baseSetting->value;
        }

        return $baseURL;
    }
}
