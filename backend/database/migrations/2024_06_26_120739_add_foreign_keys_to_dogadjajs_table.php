<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dogadjajs', function (Blueprint $table) {
            //vaza sa korisnikom
            $table->foreign('idKorisnika')->references('id')->on('users')->onDelete('cascade');

            //veza sa tipovima događaja
            $table->foreign('idTipaDogadjaja')->references('id')->on('tip_dogadjajas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dogadjajs', function (Blueprint $table) {
            //
        });
    }
};
