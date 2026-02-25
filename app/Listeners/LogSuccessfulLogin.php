<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Login; // Make sure to import Login event
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Get the user who just logged in
        $user = $event->user;

        // Update the last_login_at column
        $user->last_login_at = now();
        $user->save();
    }
}
