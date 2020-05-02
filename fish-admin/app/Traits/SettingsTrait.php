<?php
namespace App\Traits;

use App\Models\Setting;
use Carbon\Carbon;
use Exception;

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
            } catch (Exception $exception) {
                $date = Carbon::now($timeZone);
            }
        }

        return $date;
    }


    /**
     * @param $date
     * @return Carbon
     * @throws Exception
     */
    public function getNextDate($date): Carbon
    {
        $timeZone = env('APP_TIMEZONE');
        $now = Carbon::now($timeZone);

        if($date->format('Y-m-d') === $now->format('Y-m-d')) {
            return $date;
        } else {
            return $date->copy()->addDays(+1);
        }
    }

    /**
     * @param $date
     * @return Carbon
     * @throws Exception
     */
    public function getPreviousDate($date): Carbon
    {
        return $date->copy()->addDays(-1);
    }

}
