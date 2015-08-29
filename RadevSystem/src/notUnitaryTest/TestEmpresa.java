package notUnitaryTest;

import com.radev.foundation.controller.EmpresaController;
import com.radev.foundation.controller.impl.EmpresaControllerImpl;
import com.radev.foundation.entity.Empresa;

public class TestEmpresa {

	public static void main(String[] args)  {
		
		Empresa empresa = new Empresa();
		empresa.setCodigo(1);
		empresa.setNome("Empresa de Testes");
		
		EmpresaController empresaController = new EmpresaControllerImpl();
		
		try {
			empresaController.persist(empresa);
		} catch (Exception e) {
			e.printStackTrace();			
		}
		
	}

}
