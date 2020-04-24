<?php

namespace App\Http\Controllers;

use App\Setting;
use App\Http\Traits\SettingsTrait;
use App\Http\Traits\GuzzleTrait;

class CronSettingsController extends Controller
{
    use SettingsTrait, GuzzleTrait;
    public function run()
    {
        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data->status == "success") {
            foreach ($data->url as $settingName => $settingValue) {
                // Get the setting from db
                $currentSetting = Setting::where("name", $settingName)->first();
                if(!$currentSetting) {
                    // create a new one
                    $newSetting = new Setting();
                    $newSetting->name = $settingName;
                    $newSetting->value = $settingValue;
                    $newSetting->save();
                } elseif($currentSetting->value != $settingValue) {
                    // update old one
                    $currentSetting->value = $settingValue;
                    $currentSetting->save();
                }
            }
        } else {
            return $data->message;
        }
    }
}
