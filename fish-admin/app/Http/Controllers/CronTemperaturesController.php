<?php

namespace App\Http\Controllers;

use App\Models\Temperature;
use App\Traits\GuzzleTrait;
use App\Traits\SettingsTrait;
use Carbon\Carbon;

class CronTemperaturesController extends Controller
{
    use SettingsTrait, GuzzleTrait;

    protected $active = true;

    /**
     * @return mixed
     */
    public function run()
    {
        if(!$this->active) {
            die();
        }

        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data->status === 'success') {
            Temperature::create(['value' => $data->temperature]);
        } else {
            return $data->message;
        }
    }

    /**
     * @param null $date
     * @return \Illuminate\Http\JsonResponse
     */
    public function data($date = null)
    {
        try {
            $currentDate = $this->getDate($date);

            $temperaturesNight = $this->getSqlData($currentDate, '00:00', '06:59');
            $temperaturesDay = $this->getSqlData($currentDate, '07:00', '23:59');

            return response()->json(json_decode(json_encode([
                'date' => $currentDate->format("Y-m-d"),
                'day' => $temperaturesDay,
                'night' => $temperaturesNight
            ])));

        } catch (\Exception $exception) {
            $output = ['message' => $exception->getMessage()];
            return response()->json(json_decode(json_encode($output)));
        }
    }

    /**
     * @param Carbon $currentDate
     * @param $hourStart
     * @param $hourEnd
     * @return array
     */
    private function getSqlData(Carbon $currentDate, $hourStart, $hourEnd)
    {
        return Temperature::whereDate('created_at', $currentDate->toDateString())
            ->whereTime('created_at', '>=', Carbon::parse($hourStart))
            ->whereTime('created_at', '<=', Carbon::parse($hourEnd))
            ->where('value', '>', 0)
            ->orderBy('created_at', 'ASC')
            ->get(['id', 'updated_at AS time', 'value AS temperature'])
            ->toArray();
    }
}
