<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    public function handle(Logout $event): void
    {
        $user = $event->user;
        $user->last_logout_at = now();
        $user->save();
    }
}
