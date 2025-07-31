<!doctype html>
<html>
<head>
		<style type="text/css">
    .headline {
    background: #0085C9;
    color: #FAFAFA;
    padding: 15px 0;
    margin: 0 0 10px;
		}
		
		.headline h1 {
    font-size: 26px;
    margin-top: 10px;
		margin-left: 50px;
    font-weight: normal; 
		}
		
		h3 {
    font-size: 20px;
    margin-top: 0px;
		font-weight: normal; 
		padding-top: 10px;
		background-color: #82C342;
		color: white;
		}
		
		#lienzo {
		width: 100%;
    background-color: #82C342;
    color: white;
		}
		
		input {
		width: 60%;
		margin-left: 50px;
	 }
		
		select {
		width: 60%;
		margin-left: 50px;
		
		}
				
		body { 
		color: black; 
		}
		
		input[type=submit] {
    padding:5px; 
    border:2px solid #0085C9; 
    -webkit-border-radius: 5px;
    border-radius: 5px;
		color: white;
		background-color: #82C342;
		}
		
		</style>
		
		<!--<script>
			function copiar(n1, n2){
							var monto_unitario = document.getElementById(n1).value;
							
							document.getElementById(n2).value = monto_unitario;  
			}
		</script>-->
		
		<script type="text/javascript">
		
												
									function totales()
									{
									
										var opcion = document.getElementById("tipo_dte").value;
										
											if (opcion == "33") //factura electronica
											{
												
												var iva = document.getElementById("exento_afecto").value;
												
													if (iva == "1") //factura con iva
													{
														var cantidad = verificar("cantidad");
														var monto_unitario = verificar("monto_unitario");
														document.getElementById("total_exento").value = "";
														document.getElementById("total_afecto").value = monto_unitario*cantidad;
														document.getElementById("total_iva").value = ((monto_unitario*cantidad)*19)/100;
														document.getElementById("total_final").value = (monto_unitario*cantidad)+(((monto_unitario*cantidad)*19)/100);
													}
													else //factura sin iva
													{
														var cantidad = verificar("cantidad");
														var monto_unitario = verificar("monto_unitario");
														document.getElementById("total_afecto").value = "";
														document.getElementById("total_iva").value = "";
														document.getElementById("total_exento").value = monto_unitario*cantidad;
														document.getElementById("total_final").value = monto_unitario*cantidad;
													}
													
											}
											if (opcion == "34") //factura exenta electronica
											{
												document.getElementById('exento_afecto').value = "0";
												
												var cantidad = verificar("cantidad");
												var monto_unitario = verificar("monto_unitario");
												document.getElementById("total_afecto").value = "";
												document.getElementById("total_iva").value = "";
												document.getElementById("total_exento").value = monto_unitario*cantidad;
												document.getElementById("total_final").value = monto_unitario*cantidad;
											}
											if (opcion == "39" || opcion == "41") //boleta electronica ó boleta exenta electronica
											{
												document.getElementById('condiciones_pago').value = "0";
												document.getElementById('exento_afecto').value = "0";
												
												var cantidad = verificar("cantidad");
												var monto_unitario = verificar("monto_unitario");
												document.getElementById("total_afecto").value = "";
												document.getElementById("total_iva").value = "";
												document.getElementById("total_exento").value = monto_unitario*cantidad;
												document.getElementById("total_final").value = monto_unitario*cantidad;
											}
											
																								
									}
									
									
									/**
								 * Funcion para verificar los valores de los cuadros de texto. Si no es un
								 * valor numerico, cambia de color el borde del cuadro de texto
								 */
									function verificar(id)
									{
											var obj=document.getElementById(id);
											if(obj.value=="")
													value="0";
											else
													value=obj.value;
											if(validate_importe(value,1))
											{
													// marcamos como erroneo
													obj.style.borderColor="#808080";
													return value;
											}else{
													// marcamos como erroneo
													obj.style.borderColor="#f00";
													return 0;
											}
									}
								
									function validate_importe(value,decimal)
									{
											if(decimal==undefined)
													decimal=0;
							 
											if(decimal==1)
											{
													// Permite decimales tanto por . como por ,
													var patron=new RegExp("^[0-9]+((,|\.)[0-9]{1,2})?$");
											}else{
													// Numero entero normal
													var patron=new RegExp("^([0-9])*$")
											}
							 
											if(value && value.search(patron)==0)
											{
													return true;
											}
											return false;
									}
									
									
						
		</script>
		
		
</head>
<body>
		<div class="headline">
		    <div class="container">
			<div class="row">
			    <div class="span6">
				<h1 class="aller">SOAP TEST</h1>
			    </div>
			</div>
		    </div>
		</div>
		<div class="buscador">
			
					<form action="tester.php"  method="POST" name="fcontacto">
						
						<table  width=100%>
							<tr id="lienzo">
										<td><h3>ENCABEZADO</h3></td>	
							</tr>
						</table>
						
						<table width=100%>
									<thead>
										<tr>
												<th width='15%'>Tipo DTE</th>
												<th width='15%'>Fecha Emisión</th>
												<th width='15%'>Receptor Rut</th>
												<th width='15%'>Receptor Razón</th>
												<th width='15%'>Receptor Dirección</th>
												<th width='15%'>Receptor Comuna</th>
										</tr>
									</thead>
									<tbody data-bind='foreach: lines'>
										<tr>
											<td>
												<select id="tipo_dte" name="tipo_dte" onchange="totales()">
												<option value="33">Factura electronica</option>
												<option value="34">Factura exenta electronica</option>   
												<option value="39">Boleta electronica</option>
												<option value="41">Boleta exenta electronica</option> 
												</select>
											</td>
											<td>
												<input type="date" id="fecha_emision" name="fecha_emision">
											</td>
											<td>
												<input type="text" id="receptor_rut" name="receptor_rut">
											</td>
											<td>	
												<input type="text" id="receptor_razon" name="receptor_razon">
											</td>
											<td>	
												<input type="text" id="receptor_direccion" name="receptor_direccion">
											</td>
											<td>
												<input type="text" id="receptor_comuna" name="receptor_comuna">
											</td>
										</tr>
									</tbody>
									<thead>
										<tr>
												<th width='15%'>Receptor Ciudad</th>
												<th width='15%'>Receptor Telefono</th>
												<th width='15%'>Receptor Giro</th>
												<th width='15%'>Condiciones de Pago</th>
												<th width='15%'>Receptor Email</th>
												<th width='15%'>N° Orden de Compra</th>
												<th width='10%'>Fecha Orden de Compra</th>
										</tr>
									</thead>
									<tbody data-bind='foreach: lines'>
										<tr>
											<td>
												<input type="text" id="receptor_ciudad" name="receptor_ciudad">
											</td>
											<td>
												<input type="text" id="receptor_telefono" name="receptor_telefono">
											</td>
											<td>
												<input type="text" id="receptor_giro" name="receptor_giro">
											</td>
											<td>
												<select id="condiciones_pago" name="condiciones_pago">
												<option value="0" selected>Contado</option>
												<option value="30">30 dias</option>   
												<option value="0,30">0,30 dias</option>
												<option value="0,30,60">0,30,90 dias</option> 
												</select>
											</td>
											<td>
												<input type="text" id="receptor_email" name="receptor_email">
											</td>
											<td>	
												<input type="text" id="orden_compra_num" name="orden_compra_num">
											</td>
											<td>
												<input type="date" id="orden_compra_fecha" name="orden_compra_fecha">
											</td>
										</tr>
									</tbody>
												
									
									<tr id="lienzo">
										<td colspan=7><h3>DETALLE</h3></td>	
									</tr>
									<thead>
										<tr>
											<th width='15%'>Cantidad</th>
											<th width='15%'>Unidad</th>
											<th width='15%'>Glosa</th>
											<th width='15%'>Monto Unitario</th>
										</tr>
									</thead>
									<tbody data-bind='foreach: lines'>
										<tr>
											<td>
												<input type="text" id="cantidad" name="cantidad" onkeyup="totales();">
											</td>
											<td>	
												<input type="text" id="unidad" name="unidad">
											</td>
											<td>
												<input type="text" id="glosa" name="glosa">
											</td>
											<td>
												<input type="text" id="monto_unitario" name="monto_unitario" onKeyup="totales();">
											</td>
										</tr>
									</tbody>
									<thead>
										<tr>
											<th width='15%'>Exento Afecto</th>
											<th width='15%'>Descuento Recargo Monto</th>
											<th width='15%'>Descuento Recargo Porcentaje</th>
										</tr>
									</thead>
									<tbody data-bind='foreach: lines'>
										<tr>
											<td>
												<select id="exento_afecto" name="exento_afecto" onchange="totales()">
												<option value="0">Exento de IVA</option>
												<option value="1" selected>Afecto a IVA</option>   
												</select>
											</td>
											<td>
												<input type="text" id="descuentorecargo_monto" name="descuentorecargo_monto">
											</td>
											<td>
												<input type="text" id="descuentorecargo_porcentaje" name="descuentorecargo_porcentaje">
											</td>
										</tr>
									</tbody>
								
									<tr id="lienzo">
										<td colspan=7><h3>REFERENCIA</h3></td>	
									</tr>
														
									<!--<tr>
										<td>Tipo Documento referencia
										<div><select name="docreferencia_tipo">
										<option value="" selected>No aplica</option>
										<option value="33">Factura electronica</option>
										<option value="34">Factura exenta electronica</option>   
										<option value="39">Boleta electronica</option>
										<option value="41">Boleta exenta electronica</option> 
										</select></div></td>
									</tr>
									<tr>
										<td>Folio Documento referencia
										<div><input type="text" id="docreferencia_folio" name="docreferencia_folio"></div></td>
									</tr>
									<tr>
										<td>Código Referencia
										<div><select name="codigo_referencia">
										<option value="1">Anular</option>
										<option value="2" selected>Corregir texto</option>   
										<option value="3">Corregir cantidad</option>
										<option value="4">Set</option> 
										</select></div></td>
									</tr>
									<tr>
										<td>Descripción
										<div><input type="text" id="descripcion" name="descripcion"></div></td>
									</tr>-->
									
							
							<tr id="lienzo">
										<td colspan=7><h3>Totales</h3></td>	
							</tr>
							
							<thead>
								<tr>
									<th width='15%'>Descuento Recargo Global Tipo</th>
									<th width='15%'>Descuento Recargo Global Valor</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<select name="descuentorecargo_global_tipo">
										<option value="" selected>No aplica</option>
										<option value="D">Descuento global</option>
										<option value="DA">Descuento global a afectos</option>   
										<option value="DE">Descuento global a exentos</option>
										<option value="R">Recargo global</option>
										<option value="RA">Recargo global a afectos</option>
										<option value="RE">Recargo global a exentos</option>
										</select>
									</td>
									<td>	
										<input type="text" id="descuentorecargo_global_valor" name="descuentorecargo_global_valor">
									</td>
								</tr>
							</tbody>
							<thead>
								<tr>
									<th width='15%'>Total Exento</th>
									<th width='15%'>Total Afecto</th>
									<th width='15%'>Total IVA</th>
									<th width='15%'>Total Final</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<input type="text" id="total_exento" name="total_exento" readonly>
									</td>
									<td>
										<input type="text" id="total_afecto" name="total_afecto" readonly>
									</td>
									<td>
										<input type="text" id="total_iva" name="total_iva" readonly>
									</td>
									<td>
										<input type="text" id="total_final" name="total_final" readonly>
									</td>
									<td>
										<input type="submit" value="ENVIAR"/> 
									</td>
								</tr>
							</tbody>
								      
						</table>				
								<input type="hidden" name="formcompleto" value="formcompleto">		
				</form> 	
					
		</div>	
</body>
<footer>
</footer>
</html>	