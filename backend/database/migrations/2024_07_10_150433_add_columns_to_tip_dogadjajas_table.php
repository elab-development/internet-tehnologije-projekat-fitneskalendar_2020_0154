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
        Schema::table('tip_dogadjajas', function (Blueprint $table) {
           $table->unsignedBigInteger('idKorisnika')->nullable();
           $table->foreign('idKorisnika')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tip_dogadjajas', function (Blueprint $table) {
            //
        });
    }
};
