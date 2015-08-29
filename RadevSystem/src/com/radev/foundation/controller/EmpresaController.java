package com.radev.foundation.controller;

import com.radev.foundation.entity.Empresa;

public interface EmpresaController {
	public Empresa findByCodigo(int codigo);
	public Empresa findFirst();
	public void persist(Empresa empresa) throws Exception;
}
