<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\UtilizationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


// Admin and user privileges

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/research', [ResearchController::class, 'index'])->name('research.index');

    Route::get('/research/{research}', [ResearchController::class, 'show'])->name('research.show');

    Route::get('/members', [MemberController::class, 'index'])->name('members.index');

    Route::get('/proposals', [ProposalController::class, 'index'])->name('proposals.index');

    Route::get('/publications', [PublicationController::class, 'index'])->name('publications.index');

    Route::get('/utilizations', [UtilizationController::class, 'index'])->name('utilizations.index');
});


// Admin only privileges

Route::middleware(['auth', 'verified', 'admin'])->group(function () {

    Route::post('/research/store', [ResearchController::class, 'store'])->name('research.store');
    Route::patch('/research/{research}', [ResearchController::class, 'update'])->name('research.update');
    Route::delete('/research/{research}', [ResearchController::class, 'destroy'])->name('research.destroy');

    Route::post('/members/store', [MemberController::class, 'store'])->name('members.store');
    Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');

    Route::post('/publications/store', [PublicationController::class, 'store'])->name('publications.store');
    Route::patch('/publications/{publication}', [PublicationController::class, 'update'])->name('publications.update');
    Route::delete('/publications/{publication}', [PublicationController::class, 'destroy'])->name('publications.destroy');

    Route::post('/utilizations', [UtilizationController::class, 'store'])->name('utilizations.store');
    Route::put('/utilizations/{utilization}', [UtilizationController::class, 'update'])->name('utilizations.update');
    Route::delete('/utilizations/{utilization}', [UtilizationController::class, 'destroy'])->name('utilizations.destroy');

    Route::get('/admin/users', [UserController::class, 'dashboard'])->name('admin.users.dashboard');
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
