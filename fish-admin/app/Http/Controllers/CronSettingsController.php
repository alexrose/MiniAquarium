<?php

namespace App\Http\Controllers;

use App\Setting;
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
}
