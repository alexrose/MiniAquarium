<?php
namespace App\Traits;

use App\Models\Setting;
use Carbon\Carbon;

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

    public function getDate($date)
    {
        $timeZone = env("APP_TIMEZONE");
        if (!$date) {
            $date = Carbon::now($timeZone);
        } else {
            try {
                $date = Carbon::createFromFormat("Y-m-d", $date, $timeZone);
            } catch (\Exception $exception) {
                $date = Carbon::now($timeZone);
            }
        }

        return $date;
    }

}
