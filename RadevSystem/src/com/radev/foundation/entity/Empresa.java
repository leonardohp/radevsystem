package com.radev.foundation.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="empresa")

public class Empresa implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "EMPRESA_ID", sequenceName = "EMPRESA_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "EMPRESA_ID" )  
    @Column(name = "empresa_id", nullable = false )
	private int empresa_id;
	@Column(nullable = false, unique=true)
	private int codigo;	
	@Column(nullable = false, unique=true)
	@Length(max=50)
	private String nome;	
	@OneToMany(mappedBy="empresa", cascade = CascadeType.ALL)
	private List<Filial> filiais;
	
	public int getId() {
		return empresa_id;
	}
	public void setId(int id) {
		this.empresa_id = id;
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
}
