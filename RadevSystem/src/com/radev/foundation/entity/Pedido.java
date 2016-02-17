package com.radev.foundation.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="pedido")

public class Pedido implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "PEDIDO_ID", sequenceName = "PEDIDO_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "PEDIDO_ID" )  
    @Column(name = "pedido_id", nullable = false, unique=true )	
	private int pedido_id;
	@Column(nullable = false)
	private int vendedor;
	@Length(max=50)
	private String data;	
	@Length(max=50)
	private String endC;
	@Length(max=50)
	private String endE;
	private Float valor;
	@Length(max=50)
	private String condPgto;
	@Column(nullable = false, columnDefinition = "int default 0")
	private int excluido;	
	@Column(nullable = false, columnDefinition = "int default 0")
	private int liberar;
	@ManyToOne
	@JoinColumn(name = "cliente_id")
	private Cliente clientes;
	
	public int getId() {
		return pedido_id;
	}
	public void setId(int pedido_id) {
		this.pedido_id = pedido_id;
	}

	public Cliente getClientes() {
		return clientes;
	}
	public void setClientes(Cliente clientes) {
		this.clientes = clientes;
	}
	public int getVendedor() {
		return vendedor;
	}
	public void setVendedor(int vendedor) {
		this.vendedor = vendedor;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getEndC() {
		return endC;
	}
	public void setEndC(String endC) {
		this.endC = endC;
	}
	public String getEndE() {
		return endE;
	}
	public void setEndE(String endE) {
		this.endE = endE;
	}
	public Float getValor() {
		return valor;
	}
	public void setValor(Float valor) {
		this.valor = valor;
	}
	public String getCondPgto() {
		return condPgto;
	}
	public void setCondPgto(String condPgto) {
		this.condPgto = condPgto;
	}
	public int getExcluido() {
		return excluido;
	}
	public void setExcluido(int excluido) {
		this.excluido = excluido;
	}
	
	
	
	

	

}
