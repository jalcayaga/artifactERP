<?php
$tipo_dte= $_REQUEST["tipo_dte"];
$fecha_emision= $_REQUEST["fecha_emision"];
$receptor_rut= $_REQUEST["receptor_rut"];
$receptor_razon= $_REQUEST["receptor_razon"];
$receptor_direccion= $_REQUEST["receptor_direccion"];
$receptor_comuna= $_REQUEST["receptor_comuna"];
$receptor_ciudad= $_REQUEST["receptor_ciudad"];
$receptor_telefono= $_REQUEST["receptor_telefono"];
$receptor_giro= $_REQUEST["receptor_giro"];
$condiciones_pago= $_REQUEST["condiciones_pago"];
$receptor_email= $_REQUEST["receptor_email"];
$orden_compra_num= $_REQUEST["orden_compra_num"];
$orden_compra_fecha= $_REQUEST["orden_compra_fecha"];
$cantidad= $_REQUEST["cantidad"];
$unidad= $_REQUEST["unidad"];
$glosa= $_REQUEST["glosa"];
$monto_unitario= $_REQUEST["monto_unitario"];
$exento_afecto= $_REQUEST["exento_afecto"];
$descuentorecargo_monto= $_REQUEST["descuentorecargo_monto"];
$descuentorecargo_porcentaje= $_REQUEST["descuentorecargo_porcentaje"];
$docreferencia_tipo= $_REQUEST["docreferencia_tipo"];
$docreferencia_folio= $_REQUEST["docreferencia_folio"];
$codigo_referencia= $_REQUEST["codigo_referencia"];
$descripcion= $_REQUEST["descripcion"];
$descuentorecargo_global_tipo= $_REQUEST["descuentorecargo_global_tipo"];
$descuentorecargo_global_valor= $_REQUEST["descuentorecargo_global_valor"];
$total_exento= $_REQUEST["total_exento"];
$total_afecto= $_REQUEST["total_afecto"];
$total_iva= $_REQUEST["total_iva"];
$total_final= $_REQUEST["total_final"];


    
require_once(dirname(__FILE__)."/nusoap/nusoap.php");


try {

    $client = new nusoap_client("https://conexion.facto.cl/documento.php");
    $client->setCredentials("1.111.111-4/pruebasapi", "90809d7721fe3cdcf1668ccf33fea982","basic");
    
	if ($tipo_dte == "33"){	
		
		//$total_cantidad=$monto_unitario*$cantidad;
		
		$param = array(
			"documento"=>array(
					"encabezado"=>array(
						"tipo_dte"=>$tipo_dte,
						"fecha_emision"=>$fecha_emision,
						"receptor_rut"=>$receptor_rut,
						"receptor_razon"=>$receptor_razon,
						"receptor_direccion"=>$receptor_direccion,
						"receptor_comuna"=>$receptor_comuna,
						"receptor_ciudad"=>$receptor_ciudad,
						"receptor_telefono"=>$receptor_telefono,
						"receptor_giro"=>$receptor_giro,
						"condiciones_pago"=>$condiciones_pago,
						"receptor_email"=>$receptor_email,
						"orden_compra_num"=>$orden_compra_num,
						"orden_compra_fecha"=>$orden_compra_fecha,
						"receptor_giro"=>$receptor_giro,
						"condiciones_pago"=>$condiciones_pago,
						"receptor_email"=>$receptor_email,
						"orden_compra_num"=>$orden_compra_num,
						"orden_compra_fecha"=>$orden_compra_fecha
					),
				"detalles"=>array(
					"detalle"=>array(
						"cantidad"=>$cantidad,
						"unidad"=>$unidad,
						"glosa"=>$glosa,
						"monto_unitario"=>$monto_unitario,
						"exento_afecto"=>$exento_afecto,
						"descuentorecargo_monto"=>$descuentorecargo_monto,
						"descuentorecargo_porcentaje"=>$descuentorecargo_porcentaje
					)
				),
					/*"referencias"=>array(
						"docreferencia_tipo"=>$docreferencia_tipo,
						"docreferencia_folio"=>$docreferencia_folio,
						"codigo_referencia"=>$codigo_referencia,
						"descripcion"=>$descripcion
					),*/
					"totales"=>array(
					  /*descuentorecargo_global_tipo"=>$descuentorecargo_global_tipo,*/
						"descuentorecargo_global_valor"=>$descuentorecargo_global_valor,
						"total_exento"=>$total_exento,
						"total_afecto"=>$total_afecto,
						"total_iva"=>$total_iva,
						"total_final"=>$total_final
					)
			)
		);
		
	}else{
	
			//$total_cantidad=$monto_unitario*$cantidad;
		
				$param = array(
					"documento"=>array(
							"encabezado"=>array(
								"tipo_dte"=>$tipo_dte,
								"fecha_emision"=>$fecha_emision,
								"receptor_rut"=>$receptor_rut,
								"receptor_razon"=>$receptor_razon,
								"receptor_direccion"=>$receptor_direccion,
								"receptor_comuna"=>$receptor_comuna,
								"receptor_ciudad"=>$receptor_ciudad,
								"receptor_telefono"=>$receptor_telefono,
								"receptor_giro"=>$receptor_giro,
								"condiciones_pago"=>$condiciones_pago,
								"receptor_email"=>$receptor_email,
								"orden_compra_num"=>$orden_compra_num,
								"orden_compra_fecha"=>$orden_compra_fecha,
								"receptor_giro"=>$receptor_giro,
								"condiciones_pago"=>$condiciones_pago,
								"receptor_email"=>$receptor_email,
								"orden_compra_num"=>$orden_compra_num,
								"orden_compra_fecha"=>$orden_compra_fecha
							),
						"detalles"=>array(
							"detalle"=>array(
								"cantidad"=>$cantidad,
								"unidad"=>$unidad,
								"glosa"=>$glosa,
								"monto_unitario"=>$monto_unitario,
								"exento_afecto"=>$exento_afecto,
								"descuentorecargo_monto"=>$descuentorecargo_monto,
								"descuentorecargo_porcentaje"=>$descuentorecargo_porcentaje
							)
						),
							/*"referencias"=>array(
								"docreferencia_tipo"=>$docreferencia_tipo,
								"docreferencia_folio"=>$docreferencia_folio,
								"codigo_referencia"=>$codigo_referencia,
								"descripcion"=>$descripcion
							),*/
							"totales"=>array(
								/*descuentorecargo_global_tipo"=>$descuentorecargo_global_tipo,*/
								"descuentorecargo_global_valor"=>$descuentorecargo_global_valor,
								"total_exento"=>$total_exento,
								/*"total_afecto"=>$total_afecto,*/
								"total_iva"=>$total_iva,
								"total_final"=>$total_final
							)
					)
				);
	
	};
		
    //var_dump ($param); 
    
    $response = $client->call("emitirDocumento",$param);
    
    $err = $client->getError();
    
		//var_dump($client->request);
		
    if ($err) {
        echo '<p><b>Error: ' . $err . '</b></p>';
    }
    else 
    {
        print "Todo OK<br/>";
    
        var_dump($response);
    }
}
catch (Exception $e)
{
    //var_dump($e);
}

?>