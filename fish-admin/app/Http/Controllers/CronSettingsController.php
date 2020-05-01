<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Traits\SettingsTrait;
use App\Traits\GuzzleTrait;

class CronSettingsController extends Controller
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
            foreach ($data->url as $settingName => $settingValue) {
                Setting::updateOrCreate(
                    ['name' => $settingName],
                    ['name' => $settingName, 'value' => $settingValue]
                );
            }
        } else {
            return $data->message;
        }
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function data()
    {
        $baseURL = $this->getBaseUrl();
        $settings = Setting::all();

        if($settings) {
            foreach ($settings as $key => $setting) {
                if (strpos(strtolower($setting->name), 'air') !== false) {
                    $output[] = array(
                        'id' => $key,
                        'name' => $setting->name,
                        'value' => $baseURL.$setting->value,
                        'type' => 'air'
                    );
                } elseif (strpos(strtolower($setting->name), 'filter') !== false) {
                    $output[] = array(
                        'name' => $setting->name,
                        'value' => $baseURL.$setting->value,
                        'type' => 'filter'
                    );
                } elseif (strpos(strtolower($setting->name), 'light') !== false) {
                    $output[] = array(
                        'name' => $setting->name,
                        'value' => $baseURL.$setting->value,
                        'type' => 'light'
                    );
                } elseif (strpos(strtolower($setting->name), 'temperature') !== false) {
                    $output[] = array(
                        'name' => $setting->name,
                        'value' => $setting->value,
                        'type' => 'temperature'
                    );
                } elseif ($setting->name != 'base') {
                    $output[] = array(
                        'name' => $setting->name,
                        'value' => $baseURL.$setting->value,
                        'type' => 'media'
                    );
                }
            }
        } else {
            $output = ['message' => 'Settings are not present in the database.'];
        }

        return response()->json(json_decode(json_encode($output)));
    }
}
