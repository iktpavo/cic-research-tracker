<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Member;
use App\Models\Research;
use App\Models\Proposal;
use App\Models\Publication;
use App\Models\Utilization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class UserController extends Controller
{
    public function dashboard(Request $request)
    {
        $query = User::query();

        // search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('role', 'like', '%' . $request->search . '%');
            });
        }

        // role filter
        if ($request->role && $request->role !== 'any') {
            $query->where('role', $request->role);
        }

        // name sort
        $sort = $request->sort;
        if ($sort === 'asc' || $sort === 'desc') {
            $query->orderBy('name', $sort);
        } else {
            $query->orderBy('id', 'asc'); // default fallback
        }

        $users = $query->paginate(5)->withQueryString();

        // timezone
        $tz = 'Asia/Manila';
        $today = Carbon::now($tz)->toDateString();

        $activeToday = User::whereDate('last_login_at', $today)->count();
        $activeTodayPrev = User::whereDate('last_login_at', Carbon::yesterday($tz))->count();
        $newThisWeek = User::where('created_at', '>=', Carbon::now($tz)->subDays(7))->count();

        $allUsers = User::all();
        $past7daysCount = $allUsers->filter(function ($user) use ($tz) {
            return $user->last_login_at && Carbon::parse($user->last_login_at, $tz) >= Carbon::now($tz)->subDays(7);
        })->count();

        $loginTraffic = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now($tz)->subDays($i)->toDateString();
            $count = $allUsers->filter(function ($user) use ($date, $tz) {
                if (!$user->last_login_at) return false;
                $login = Carbon::parse($user->last_login_at, $tz)->toDateString();
                return $login === $date;
            })->count();
            $loginTraffic[] = ['date' => $date, 'count' => $count];
        }

        // stats for mixed bar graph
        $halfYearStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $halfYearStats[] = [
                'month' => $month->format('M'),
                'research' => Research::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'researchMember' => Member::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                // Shows number of members that have research 
                //   'researchMember' => Member::whereHas('research', function ($q) use ($month) {
                //     $q->whereMonth('research.created_at', $month->month); // <- explicitly prefix
                // })->count(),
                'publications' => Publication::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'utilizations' => Utilization::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'user' =>  User::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),

            ];
        }

        // total research members
        $researchMember = User::where('role', 'research_member')->count();

        return Inertia::render('UserManagement/UserDashboard', [
            'users' => $users,
            'activeToday' => $activeToday,
            'activeTodayPrev' => $activeTodayPrev,
            'newThisWeek' => $newThisWeek,
            'past7daysCount' => $past7daysCount,
            'loginTraffic' => $loginTraffic,
            'halfYearStats' => $halfYearStats,
            'researchMember' => $researchMember,
            'search' => $request->search ?? '',
            'role' => $request->role ?? 'any',
            'sort' => $request->sort ?? '',
            'timeRange' => $request->timeRange ?? '30d',
            'allUsers' => $allUsers,
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.dashboard')
            ->with('message', 'User deleted successfully');
    }
}
