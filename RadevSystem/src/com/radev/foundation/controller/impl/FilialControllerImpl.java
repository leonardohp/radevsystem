package com.radev.foundation.controller.impl;

import com.radev.foundation.controller.FilialController;
import com.radev.foundation.entity.Filial;
import com.radev.foundation.persistence.FilialDAO;

public class FilialControllerImpl implements FilialController {
	
	private FilialDAO filialDAO = new FilialDAO();;
	
	@Override
	public Filial findByCodigo(int codigo) {
		return filialDAO.findByCodigo(codigo);
	}

	@Override
	public void persist(Filial filial) throws Exception {
		try {
			filialDAO.persist(filial);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}

}
