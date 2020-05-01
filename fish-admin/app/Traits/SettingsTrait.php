<?php
namespace App\Traits;

use App\Models\Setting;
use Carbon\Carbon;

trait SettingsTrait
{
    /**
     * @return mixed
     */
    public function getBaseUrl()
    {
        $baseURL = env('ESP_ADDRESS');
        $baseSetting = Setting::where('name', 'base')->first();

        if ($baseSetting && $baseSetting->name && $baseSetting->value) {
            $baseURL = $baseSetting->value;
        }

        return $baseURL;
    }

    /**
     * @param $date
     * @return Carbon
     */
    public function getDate($date): Carbon
    {
        $timeZone = env('APP_TIMEZONE');
        if (!$date) {
            $date = Carbon::now($timeZone);
        } else {
            try {
                $date = Carbon::createFromFormat('Y-m-d', $date, $timeZone);
            } catch (\Exception $exception) {
                $date = Carbon::now($timeZone);
            }
        }

        return $date;
    }

}
