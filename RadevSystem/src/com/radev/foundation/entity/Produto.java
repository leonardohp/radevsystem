package com.radev.foundation.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="produto")

public class Produto implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "PRODUTO_ID", sequenceName = "PRODUTO_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "PRODUTO_ID" )  
    @Column(name = "produto_id", nullable = false, unique=true )	
	private int produto_id;
	@Column(nullable = false)
	@Length(max=50)
	private String descricao;
	private Float valor;
	
	public int getId() {
		return produto_id;
	}
	public void setId(int produto_id) {
		this.produto_id = produto_id;
	}
	public int getProduto_id() {
		return produto_id;
	}
	public void setProduto_id(int produto_id) {
		this.produto_id = produto_id;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public Float getValor() {
		return valor;
	}
	public void setValor(Float valor) {
		this.valor = valor;
	}
	
	
	

	

}
