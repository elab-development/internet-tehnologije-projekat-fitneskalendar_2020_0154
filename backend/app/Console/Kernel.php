<?php

namespace App\Console;

use App\Console\Commands\PosaljiNotifikaciju;
use App\Mail\NotifikacijaMail;
use App\Models\Notifikacija;
use Illuminate\Console\Command;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Mail;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected $commands = [
        PosaljiNotifikaciju::class,
    ];
    protected function schedule(Schedule $schedule)
    {
        
        $schedule->command('notifikacije:posalji')->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
