package com.radev.foundation.controller;

import com.radev.foundation.entity.Filial;

public interface FilialController {
	public Filial findByCodigo(int codigo);
	public void persist(Filial filial) throws Exception;
}
