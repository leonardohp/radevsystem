package com.radev.foundation.controller.impl;

import com.radev.foundation.controller.EmpresaController;
import com.radev.foundation.entity.Empresa;
import com.radev.foundation.persistence.EmpresaDAO;

public class EmpresaControllerImpl implements EmpresaController {
	
	private EmpresaDAO empresaDAO = new EmpresaDAO();;
	
	@Override
	public Empresa findByCodigo(int codigo) {
		return empresaDAO.findByCodigo(codigo);
	}

	@Override
	public void persist(Empresa empresa) throws Exception {
		try {
			empresaDAO.persist(empresa);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}

	@Override
	public Empresa findFirst() {
		return empresaDAO.findFirst();
	}

}
