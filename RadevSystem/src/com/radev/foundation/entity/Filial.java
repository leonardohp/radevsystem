package com.radev.foundation.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="filial")

public class Filial implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "FILIAL_ID", sequenceName = "FILIAL_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "FILIAL_ID" )
    @Column(name = "filial_id", nullable = false )	
	private int filial_id;
	@Column(nullable = false, unique=true)
	private int codigo;	
	@Column(nullable = false, unique=true)
	@Length(max=50)
	private String nome;
	@Column(nullable = false, unique=true)
	@Length(max=14)
	private String cnpj;
	@ManyToOne
	@PrimaryKeyJoinColumn
	private Empresa empresa;	
	
	public int getId() {
		return filial_id;
	}
	public void setId(int id) {
		this.filial_id = id;
	}
	public int getCodigo() {
		return codigo;
	}
	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getCnpj() {
		return cnpj;
	}
	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}
	public Empresa getEmpresa() {
		return empresa;
	}
	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}
	
}
