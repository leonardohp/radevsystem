package com.radev.foundation.utils;

public enum TipoUsuario {
	
	SUPER(1),DIRETORIA(2),GERENCIA(3),VENDAS(4),ADMINISTRATIVO(5);

	public int tipoUsuario;
	
	TipoUsuario(int tipo) {
		tipoUsuario = tipo;
	}
	
	public int getTipo() {
		return tipoUsuario;
	}
		
}
