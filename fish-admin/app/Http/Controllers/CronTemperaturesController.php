<?php

namespace App\Http\Controllers;

use App\Models\Temperature;
use App\Traits\GuzzleTrait;
use App\Traits\SettingsTrait;
use Carbon\Carbon;

class CronTemperaturesController extends Controller
{
    use SettingsTrait, GuzzleTrait;

    public function run()
    {
        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data->status == "success") {
            Temperature::create(["value" => $data->temperature]);
        } else {
            return $data->message;
        }
    }

    public function data($date = null)
    {
        try {
            $currentDate = $this->getDate($date);
            $temperaturesNight = Temperature::whereDate("created_at", $currentDate->toDateString())
                ->whereTime('created_at', '>=', Carbon::parse('00:00'))
                ->whereTime('created_at', '<=', Carbon::parse('07:00'))
                ->where('value', '>' , 0)
                ->orderBy('created_at', 'ASC')
                ->get();

            foreach ($temperaturesNight as $key => $temperature) {
                $night[] = array(
                    "id" => $key,
                    "time" => $temperature->created_at->format("H:i"),
                    "temperature" => number_format($temperature->value, 2)
                );
            }

            $temperaturesDay = Temperature::whereDate("created_at", $currentDate->toDateString())
                ->whereTime('created_at', '>=', Carbon::parse('07:00'))
                ->whereTime('created_at', '<=', Carbon::parse('23:59'))
                ->where('value', '>' , 0)
                ->orderBy('created_at', 'ASC')
                ->get();

            foreach ($temperaturesDay as $key => $temperature) {
                $day[] = array(
                    "id" => $key,
                    "time" => $temperature->created_at->format("H:i"),
                    "temperature" => number_format($temperature->value, 2)
                );
            }

            return response()->json(json_decode(json_encode([
                'day' => $day,
                'night' => $night
            ])));

        } catch (\Exception $exception) {
            $output = ['message' => $exception->getMessage()];
            return response()->json(json_decode(json_encode($output)));
        }
    }
}
