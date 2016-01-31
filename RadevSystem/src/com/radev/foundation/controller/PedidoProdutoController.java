package com.radev.foundation.controller;

import java.util.List;

import com.radev.foundation.entity.PedidoProduto;
import com.radev.foundation.entity.Usuario;

public interface PedidoProdutoController {
	public PedidoProduto findByLogin(String login);
	public void persist(PedidoProduto cliente) throws Exception;
	public List<PedidoProduto> listAll();
	public boolean excluir(int p);
}
