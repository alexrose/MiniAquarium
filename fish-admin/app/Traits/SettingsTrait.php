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


    /**
     * @param $date
     * @return Carbon
     * @throws \Exception
     */
    public function getNextDate($date): Carbon
    {
        $timeZone = env('APP_TIMEZONE');
        $now = Carbon::now($timeZone);
        $nextDate = new Carbon($date);


        if($nextDate->format('Y-m-d') === $now->format('Y-m-d')) {
            return $nextDate;
        } else {
            return $nextDate->addDays(1);
        }
    }

    /**
     * @param $date
     * @return Carbon
     * @throws \Exception
     */
    public function getPreviousDate($date): Carbon
    {
        $prevDate = new Carbon($date);
        return $prevDate->addDays(-1);
    }

}
