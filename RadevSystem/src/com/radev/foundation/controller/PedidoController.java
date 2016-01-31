package com.radev.foundation.controller;

import java.util.List;

import com.radev.foundation.entity.Pedido;
import com.radev.foundation.entity.Usuario;

public interface PedidoController {
	public Pedido findById(int login);
	public void persist(Pedido cliente) throws Exception;
	public List<Pedido> listAll();
	public int getLastPedido();
	public boolean excluir(int p);
}
