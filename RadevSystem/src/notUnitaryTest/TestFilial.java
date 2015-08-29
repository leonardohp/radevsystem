package notUnitaryTest;

import com.radev.foundation.controller.EmpresaController;
import com.radev.foundation.controller.FilialController;
import com.radev.foundation.controller.impl.EmpresaControllerImpl;
import com.radev.foundation.controller.impl.FilialControllerImpl;
import com.radev.foundation.entity.Empresa;
import com.radev.foundation.entity.Filial;

public class TestFilial {
	
	public static void main(String[] args) throws Exception  {
		
		EmpresaController empresaController = new EmpresaControllerImpl();
		Empresa empresa = empresaController.findFirst();
		
		Filial filial = new Filial();
		
		filial.setCodigo(1);
		filial.setNome("Filial de Testes");
		filial.setCnpj("12345678000101");
		filial.setEmpresa(empresa);
		
		FilialController filialController = new FilialControllerImpl();
		filialController.persist(filial);

		Filial filial2 = new Filial();
		
		filial2.setCodigo(2);
		filial2.setNome("Filial de Testes - 2");
		filial2.setCnpj("12345678000202");
		filial2.setEmpresa(empresa);
		
		FilialController filialController2 = new FilialControllerImpl();		
		
		try {
			filialController.persist(filial);
			filialController2.persist(filial2);
		} catch (Exception e) {
			e.printStackTrace();			
		}
		
	}

}
