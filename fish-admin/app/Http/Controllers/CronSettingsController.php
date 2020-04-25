<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Traits\SettingsTrait;
use App\Traits\GuzzleTrait;

class CronSettingsController extends Controller
{
    use SettingsTrait, GuzzleTrait;
    public function run()
    {
        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data->status == "success") {
            foreach ($data->url as $settingName => $settingValue) {
                Setting::updateOrCreate(
                    ["name" => $settingName],
                    ["name" => $settingName, "value" => $settingValue]
                );
            }
        } else {
            return $data->message;
        }
    }

    public function data()
    {
        $baseURL = $this->getBaseUrl();
        $settings = Setting::all();
        $data = [];
        foreach ($settings as $setting) {

            if (strpos($setting->name, "air") !== false) {
                $data['button']['air'][$setting->name] = $baseURL.$setting->value;
            } elseif (strpos($setting->name, "filter") !== false) {
                $data['button']['filter'][$setting->name] = $baseURL.$setting->value;
            } elseif (strpos($setting->name, "light") !== false) {
                $data['button']['light'][$setting->name] = $baseURL.$setting->value;
            } elseif ($setting->name != "base") {
                $data['media'][$setting->name] =  $baseURL.$setting->value;
            }
        }

        return response()->json($data);
    }
}
