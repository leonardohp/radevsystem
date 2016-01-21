<?php

    $con = mysqli_connect("localhost:3306", "root", "", "test") or die('Unable to Connect');

    $sql = "Select * from user";

    $query = mysqli_query($con, $sql);
    while ($reg = mysqli_fetch_array($query)) {
        $rows[] = array($reg['id'],$reg['nome'],$reg['email'],$reg['cpf'],$reg['rg']);
    }
    
    print json_encode($rows);
    
    mysqli_close($con);

