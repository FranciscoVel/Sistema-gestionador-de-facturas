/*==============================================================*/
/* DBMS name:      ORACLE Version 12c                           */
/* Created on:     22/11/2023 6:31:35 p. m.                     */
/*==============================================================*/


alter table CARGO
   drop constraint FK_CARGO_CARGO_CAR_CARGO;

alter table CARGO
   drop constraint FK_CARGO_DEPENDENC_DEPENDEN;

alter table CATPRODUCTO
   drop constraint FK_CATPRODU_CATPROD_C_CATPRODU;

alter table CONTACTO
   drop constraint FK_CONTACTO_PERSONA_C_PERSONA;

alter table CONTACTO
   drop constraint FK_CONTACTO_TIPO_CONT_TIPOCONT;

alter table DETALLEFACTURA
   drop constraint FK_DETALLEF_FAC_DETAL_FACTURA;

alter table DETALLEFACTURA
   drop constraint FK_DETALLEF_PRODUCTO__PRODUCTO;

alter table DIRECCION
   drop constraint FK_DIRECCIO_PERSONA_D_PERSONA;

alter table DIRECCION
   drop constraint FK_DIRECCIO_RELATIONS_COMPONEN;

alter table DIRECCION
   drop constraint FK_DIRECCIO_RELATIONS_NOMENCLA;

alter table EMPLEADOS_CARGOS
   drop constraint FK_EMPLEADO_EMPLEADOS_CARGO;

alter table EMPLEADOS_CARGOS
   drop constraint FK_EMPLEADO_EMPLEADOS_EMPLEADO;

alter table FACTURA
   drop constraint FK_FACTURA_FACMODIFI_FACTURA;

alter table FACTURA
   drop constraint FK_FACTURA_PERSONA_F_PERSONA;

alter table FACTURA
   drop constraint FK_FACTURA_RELATIONS_EMPLEADO;

alter table FACTURA
   drop constraint FK_FACTURA_TIPO_FACT_TIPOFACT;

alter table HISTORICOPRECIO
   drop constraint FK_HISTORIC_PRODUCTO__PRODUCTO;

alter table INVENTARIO
   drop constraint FK_INVENTAR_INVENTARI_INVENTAR;

alter table INVENTARIO
   drop constraint FK_INVENTAR_PRODUCTO__PRODUCTO;

alter table INVENTARIO
   drop constraint FK_INVENTAR_SOPORTE_DETALLEF;

alter table NOMENCLATURA
   drop constraint FK_NOMENCLA_COM_COMPONEN;

alter table PERSONA
   drop constraint FK_PERSONA_TIPODOC_P_TIPODOC;

alter table PERSONA
   drop constraint FK_PERSONA_TIPO_PERS_TIPOPERS;

alter table PRODUCTO
   drop constraint FK_PRODUCTO_CATPROD_P_CATPRODU;

drop index CARGO_CARGO_FK;

drop index DEPENDENCIA_CARGO_FK;

drop table CARGO cascade constraints;

drop index CATPROD_CATPROD_FK;

drop table CATPRODUCTO cascade constraints;

drop table COMPONENTEDIRECC cascade constraints;

drop index PERSONA_CONTACTO_FK;

drop index TIPO_CONTACTO_FK;

drop table CONTACTO cascade constraints;

drop table DEPENDENCIA cascade constraints;

drop index PRODUCTO_DETALLE_FK;

drop table DETALLEFACTURA cascade constraints;

drop index RELATIONSHIP_23_FK;

drop index RELATIONSHIP_22_FK;

drop index PERSONA_DIRECCION_FK;

drop table DIRECCION cascade constraints;

drop table EMPLEADO cascade constraints;

drop index EMPLEADOS_CARGOS_FK;

drop index EMPLEADOS_CARGOS2_FK;

drop table EMPLEADOS_CARGOS cascade constraints;

drop index FACMODIFICADA_FK;

drop index TIPO_FACTURA_FK;

drop index PERSONA_FACTURA_FK;

drop index RELATIONSHIP_24_FK;

drop table FACTURA cascade constraints;

drop index PRODUCTO_HISTORICO_FK;

drop table HISTORICOPRECIO cascade constraints;

drop index INVENTARIOMODIFICADO_FK;

drop index SOPORTE_FK;

drop index PRODUCTO_INVENTARIO_FK;

drop table INVENTARIO cascade constraints;

drop index COM_FK;

drop table NOMENCLATURA cascade constraints;

drop index TIPO_PERSONA_FK;

drop index TIPODOC_PERSONA_FK;

drop table PERSONA cascade constraints;

drop index CATPROD_PRODUCTO_FK;

drop table PRODUCTO cascade constraints;

drop table TIPOCONTACTO cascade constraints;

drop table TIPODOC cascade constraints;

drop table TIPOFACTURA cascade constraints;

drop table TIPOPERSONA cascade constraints;

/*==============================================================*/
/* Table: CARGO                                                 */
/*==============================================================*/
create table CARGO (
   CODCARGO             VARCHAR2(5)           not null,
   CODDEPENDENCIA       VARCHAR2(5)           not null,
   CAR_CODCARGO         VARCHAR2(5),
   NOMCARGO             VARCHAR2(40)          not null,
   ESTADOCARGO          VARCHAR2(5)           not null,
   constraint PK_CARGO primary key (CODCARGO)
);

/*==============================================================*/
/* Index: DEPENDENCIA_CARGO_FK                                  */
/*==============================================================*/
create index DEPENDENCIA_CARGO_FK on CARGO (
   CODDEPENDENCIA ASC
);

/*==============================================================*/
/* Index: CARGO_CARGO_FK                                        */
/*==============================================================*/
create index CARGO_CARGO_FK on CARGO (
   CAR_CODCARGO ASC
);

/*==============================================================*/
/* Table: CATPRODUCTO                                           */
/*==============================================================*/
create table CATPRODUCTO (
   IDCATPRODUCTO        VARCHAR2(3)           not null,
   CAT_IDCATPRODUCTO    VARCHAR2(3),
   DESCCATPRODUCTO      VARCHAR2(30)          not null,
   constraint PK_CATPRODUCTO primary key (IDCATPRODUCTO)
);

/*==============================================================*/
/* Index: CATPROD_CATPROD_FK                                    */
/*==============================================================*/
create index CATPROD_CATPROD_FK on CATPRODUCTO (
   CAT_IDCATPRODUCTO ASC
);

/*==============================================================*/
/* Table: COMPONENTEDIRECC                                      */
/*==============================================================*/
create table COMPONENTEDIRECC (
   POSICION             NUMBER(2,0)           not null,
   DESCPOSICION         VARCHAR2(30)          not null,
   OBLIGATORIEDAD       VARCHAR2(5)           not null,
   constraint PK_COMPONENTEDIRECC primary key (POSICION)
);

/*==============================================================*/
/* Table: CONTACTO                                              */
/*==============================================================*/
create table CONTACTO (
   CONSECCONTACTO       NUMBER(4,0)           not null,
   IDTIPOCONTACTO       VARCHAR2(2)           not null,
   DESCTIPOCONTACTO     VARCHAR2(15)          not null,
   IDTIPOPERSONA        VARCHAR2(2)           not null,
   IDTIPODOC            VARCHAR2(2)           not null,
   NDOCUMENTO           VARCHAR2(12)          not null,
   DESCCONTACTO         VARCHAR2(40)          not null,
   constraint PK_CONTACTO primary key (CONSECCONTACTO)
);

/*==============================================================*/
/* Index: TIPO_CONTACTO_FK                                      */
/*==============================================================*/
create index TIPO_CONTACTO_FK on CONTACTO (
   IDTIPOCONTACTO ASC,
   DESCTIPOCONTACTO ASC
);

/*==============================================================*/
/* Index: PERSONA_CONTACTO_FK                                   */
/*==============================================================*/
create index PERSONA_CONTACTO_FK on CONTACTO (
   IDTIPOPERSONA ASC,
   IDTIPODOC ASC,
   NDOCUMENTO ASC
);

/*==============================================================*/
/* Table: DEPENDENCIA                                           */
/*==============================================================*/
create table DEPENDENCIA (
   CODDEPENDENCIA       VARCHAR2(5)           not null,
   NOMDEPENDENCIA       VARCHAR2(30)          not null,
   ESTADODEPEN          SMALLINT              not null,
   constraint PK_DEPENDENCIA primary key (CODDEPENDENCIA)
);

/*==============================================================*/
/* Table: DETALLEFACTURA                                        */
/*==============================================================*/
create table DETALLEFACTURA (
   IDTIPOFAC            VARCHAR2(2)           not null,
   NFACTURA             VARCHAR2(5)           not null,
   ITEM                 NUMBER(3,0)           not null,
   IDCATPRODUCTO        VARCHAR2(3)           not null,
   REFPRODUCTO          VARCHAR2(5)           not null,
   CANTIDAD             NUMBER(3,0)           not null,
   PRECIO               NUMBER(6,2)           not null,
   constraint PK_DETALLEFACTURA primary key (IDTIPOFAC, NFACTURA, ITEM)
);

/*==============================================================*/
/* Index: PRODUCTO_DETALLE_FK                                   */
/*==============================================================*/
create index PRODUCTO_DETALLE_FK on DETALLEFACTURA (
   IDCATPRODUCTO ASC,
   REFPRODUCTO ASC
);

/*==============================================================*/
/* Table: DIRECCION                                             */
/*==============================================================*/
create table DIRECCION (
   POSICION             NUMBER(2,0)           not null,
   IDTIPOPERSONA        VARCHAR2(2)           not null,
   IDTIPODOC            VARCHAR2(2)           not null,
   NDOCUMENTO           VARCHAR2(12)          not null,
   IDDIRECCION          NUMBER(3,0)           not null,
   IDNOMEN              VARCHAR2(5),
   VALORDIREC           VARCHAR2(15),
   constraint PK_DIRECCION primary key (POSICION, IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO, IDDIRECCION)
);

/*==============================================================*/
/* Index: PERSONA_DIRECCION_FK                                  */
/*==============================================================*/
create index PERSONA_DIRECCION_FK on DIRECCION (
   IDTIPOPERSONA ASC,
   IDTIPODOC ASC,
   NDOCUMENTO ASC
);

/*==============================================================*/
/* Index: RELATIONSHIP_22_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_22_FK on DIRECCION (
   POSICION ASC
);

/*==============================================================*/
/* Index: RELATIONSHIP_23_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_23_FK on DIRECCION (
   IDNOMEN ASC
);

/*==============================================================*/
/* Table: EMPLEADO                                              */
/*==============================================================*/
create table EMPLEADO (
   CODEMPLEADO          VARCHAR2(5)           not null,
   NOMEMPLEADO          VARCHAR2(30)          not null,
   APELLEMPLEADO        VARCHAR2(30)          not null,
   CORREO               VARCHAR2(50)          not null,
   constraint PK_EMPLEADO primary key (CODEMPLEADO)
);

/*==============================================================*/
/* Table: EMPLEADOS_CARGOS                                      */
/*==============================================================*/
create table EMPLEADOS_CARGOS (
   CODCARGO             VARCHAR2(5)           not null,
   CODEMPLEADO          VARCHAR2(5)           not null,
   constraint PK_EMPLEADOS_CARGOS primary key (CODCARGO, CODEMPLEADO)
);

/*==============================================================*/
/* Index: EMPLEADOS_CARGOS2_FK                                  */
/*==============================================================*/
create index EMPLEADOS_CARGOS2_FK on EMPLEADOS_CARGOS (
   CODEMPLEADO ASC
);

/*==============================================================*/
/* Index: EMPLEADOS_CARGOS_FK                                   */
/*==============================================================*/
create index EMPLEADOS_CARGOS_FK on EMPLEADOS_CARGOS (
   CODCARGO ASC
);

/*==============================================================*/
/* Table: FACTURA                                               */
/*==============================================================*/
create table FACTURA (
   IDTIPOFAC            VARCHAR2(2)           not null,
   NFACTURA             VARCHAR2(5)           not null,
   IDTIPOPERSONA        VARCHAR2(2)           not null,
   IDTIPODOC            VARCHAR2(2)           not null,
   NDOCUMENTO           VARCHAR2(12)          not null,
   FAC_IDTIPOFAC        VARCHAR2(2),
   FAC_NFACTURA         VARCHAR2(5),
   CODEMPLEADO          VARCHAR2(5)           not null,
   FECHAFACTURA         DATE                  not null,
   TOTALFACTURA         NUMBER(12,2)          not null,
   constraint PK_FACTURA primary key (IDTIPOFAC, NFACTURA)
);

/*==============================================================*/
/* Index: RELATIONSHIP_24_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_24_FK on FACTURA (
   CODEMPLEADO ASC
);

/*==============================================================*/
/* Index: PERSONA_FACTURA_FK                                    */
/*==============================================================*/
create index PERSONA_FACTURA_FK on FACTURA (
   IDTIPOPERSONA ASC,
   IDTIPODOC ASC,
   NDOCUMENTO ASC
);

/*==============================================================*/
/* Index: TIPO_FACTURA_FK                                       */
/*==============================================================*/
create index TIPO_FACTURA_FK on FACTURA (
   IDTIPOFAC ASC
);

/*==============================================================*/
/* Index: FACMODIFICADA_FK                                      */
/*==============================================================*/
create index FACMODIFICADA_FK on FACTURA (
   FAC_IDTIPOFAC ASC,
   FAC_NFACTURA ASC
);

/*==============================================================*/
/* Table: HISTORICOPRECIO                                       */
/*==============================================================*/
create table HISTORICOPRECIO (
   IDCATPRODUCTO        VARCHAR2(3)           not null,
   REFPRODUCTO          VARCHAR2(5)           not null,
   CONSECPRECIO         NUMBER(4,0)           not null,
   FECHAINICIO          DATE                  not null,
   FECHAFIN             DATE,
   VALOR                NUMBER(6,2),
   constraint PK_HISTORICOPRECIO primary key (IDCATPRODUCTO, REFPRODUCTO, CONSECPRECIO)
);

/*==============================================================*/
/* Index: PRODUCTO_HISTORICO_FK                                 */
/*==============================================================*/
create index PRODUCTO_HISTORICO_FK on HISTORICOPRECIO (
   IDCATPRODUCTO ASC,
   REFPRODUCTO ASC
);

/*==============================================================*/
/* Table: INVENTARIO                                            */
/*==============================================================*/
create table INVENTARIO (
   CONSECINVEN          NUMBER(5,0)           not null,
   IDCATPRODUCTO        VARCHAR2(3)           not null,
   REFPRODUCTO          VARCHAR2(5)           not null,
   IDTIPOFAC            VARCHAR2(2)           not null,
   NFACTURA             VARCHAR2(5)           not null,
   ITEM                 NUMBER(3,0)           not null,
   INVENTARIOMODIFICADO NUMBER(5,0),
   FECHAINVE            DATE                  not null,
   SALEN                NUMBER(5,0),
   ENTRAN               NUMBER(5,0),
   EXISTENCIA           NUMBER(5,0)           not null,
   constraint PK_INVENTARIO primary key (CONSECINVEN)
);

/*==============================================================*/
/* Index: PRODUCTO_INVENTARIO_FK                                */
/*==============================================================*/
create index PRODUCTO_INVENTARIO_FK on INVENTARIO (
   IDCATPRODUCTO ASC,
   REFPRODUCTO ASC
);

/*==============================================================*/
/* Index: SOPORTE_FK                                            */
/*==============================================================*/
create index SOPORTE_FK on INVENTARIO (
   IDTIPOFAC ASC,
   NFACTURA ASC,
   ITEM ASC
);

/*==============================================================*/
/* Index: INVENTARIOMODIFICADO_FK                               */
/*==============================================================*/
create index INVENTARIOMODIFICADO_FK on INVENTARIO (
   INVENTARIOMODIFICADO ASC
);

/*==============================================================*/
/* Table: NOMENCLATURA                                          */
/*==============================================================*/
create table NOMENCLATURA (
   IDNOMEN              VARCHAR2(5)           not null,
   POSICION             NUMBER(2,0)           not null,
   DESCNOMEN            VARCHAR2(30),
   constraint PK_NOMENCLATURA primary key (IDNOMEN)
);

/*==============================================================*/
/* Index: COM_FK                                                */
/*==============================================================*/
create index COM_FK on NOMENCLATURA (
   POSICION ASC
);

/*==============================================================*/
/* Table: PERSONA                                               */
/*==============================================================*/
create table PERSONA (
   IDTIPOPERSONA        VARCHAR2(2)           not null,
   IDTIPODOC            VARCHAR2(2)           not null,
   NDOCUMENTO           VARCHAR2(12)          not null,
   NOMBRE               VARCHAR2(30)          not null,
   APELLIDO             VARCHAR2(30),
   constraint PK_PERSONA primary key (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO)
);

/*==============================================================*/
/* Index: TIPODOC_PERSONA_FK                                    */
/*==============================================================*/
create index TIPODOC_PERSONA_FK on PERSONA (
   IDTIPODOC ASC
);

/*==============================================================*/
/* Index: TIPO_PERSONA_FK                                       */
/*==============================================================*/
create index TIPO_PERSONA_FK on PERSONA (
   IDTIPOPERSONA ASC
);

/*==============================================================*/
/* Table: PRODUCTO                                              */
/*==============================================================*/
create table PRODUCTO (
   IDCATPRODUCTO        VARCHAR2(3)           not null,
   REFPRODUCTO          VARCHAR2(5)           not null,
   NOMPRODUCTO          VARCHAR2(30)          not null,
   constraint PK_PRODUCTO primary key (IDCATPRODUCTO, REFPRODUCTO)
);

/*==============================================================*/
/* Index: CATPROD_PRODUCTO_FK                                   */
/*==============================================================*/
create index CATPROD_PRODUCTO_FK on PRODUCTO (
   IDCATPRODUCTO ASC
);

/*==============================================================*/
/* Table: TIPOCONTACTO                                          */
/*==============================================================*/
create table TIPOCONTACTO (
   IDTIPOCONTACTO       VARCHAR2(2)           not null,
   DESCTIPOCONTACTO     VARCHAR2(15)          not null,
   constraint PK_TIPOCONTACTO primary key (IDTIPOCONTACTO, DESCTIPOCONTACTO)
);

/*==============================================================*/
/* Table: TIPODOC                                               */
/*==============================================================*/
create table TIPODOC (
   IDTIPODOC            VARCHAR2(2)           not null,
   DESCTIPODOC          VARCHAR2(20)          not null,
   constraint PK_TIPODOC primary key (IDTIPODOC)
);

/*==============================================================*/
/* Table: TIPOFACTURA                                           */
/*==============================================================*/
create table TIPOFACTURA (
   IDTIPOFAC            VARCHAR2(2)           not null,
   DESCTIPOFAC          VARCHAR2(30)          not null,
   constraint PK_TIPOFACTURA primary key (IDTIPOFAC)
);

/*==============================================================*/
/* Table: TIPOPERSONA                                           */
/*==============================================================*/
create table TIPOPERSONA (
   IDTIPOPERSONA        VARCHAR2(2)           not null,
   DESCTIPOPERSONA      VARCHAR2(20)          not null,
   constraint PK_TIPOPERSONA primary key (IDTIPOPERSONA)
);

alter table CARGO
   add constraint FK_CARGO_CARGO_CAR_CARGO foreign key (CAR_CODCARGO)
      references CARGO (CODCARGO);

alter table CARGO
   add constraint FK_CARGO_DEPENDENC_DEPENDEN foreign key (CODDEPENDENCIA)
      references DEPENDENCIA (CODDEPENDENCIA);

alter table CATPRODUCTO
   add constraint FK_CATPRODU_CATPROD_C_CATPRODU foreign key (CAT_IDCATPRODUCTO)
      references CATPRODUCTO (IDCATPRODUCTO);

alter table CONTACTO
   add constraint FK_CONTACTO_PERSONA_C_PERSONA foreign key (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO)
      references PERSONA (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO);

alter table CONTACTO
   add constraint FK_CONTACTO_TIPO_CONT_TIPOCONT foreign key (IDTIPOCONTACTO, DESCTIPOCONTACTO)
      references TIPOCONTACTO (IDTIPOCONTACTO, DESCTIPOCONTACTO);

alter table DETALLEFACTURA
   add constraint FK_DETALLEF_FAC_DETAL_FACTURA foreign key (IDTIPOFAC, NFACTURA)
      references FACTURA (IDTIPOFAC, NFACTURA);

alter table DETALLEFACTURA
   add constraint FK_DETALLEF_PRODUCTO__PRODUCTO foreign key (IDCATPRODUCTO, REFPRODUCTO)
      references PRODUCTO (IDCATPRODUCTO, REFPRODUCTO);

alter table DIRECCION
   add constraint FK_DIRECCIO_PERSONA_D_PERSONA foreign key (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO)
      references PERSONA (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO);

alter table DIRECCION
   add constraint FK_DIRECCIO_RELATIONS_COMPONEN foreign key (POSICION)
      references COMPONENTEDIRECC (POSICION);

alter table DIRECCION
   add constraint FK_DIRECCIO_RELATIONS_NOMENCLA foreign key (IDNOMEN)
      references NOMENCLATURA (IDNOMEN);

alter table EMPLEADOS_CARGOS
   add constraint FK_EMPLEADO_EMPLEADOS_CARGO foreign key (CODCARGO)
      references CARGO (CODCARGO);

alter table EMPLEADOS_CARGOS
   add constraint FK_EMPLEADO_EMPLEADOS_EMPLEADO foreign key (CODEMPLEADO)
      references EMPLEADO (CODEMPLEADO);

alter table FACTURA
   add constraint FK_FACTURA_FACMODIFI_FACTURA foreign key (FAC_IDTIPOFAC, FAC_NFACTURA)
      references FACTURA (IDTIPOFAC, NFACTURA);

alter table FACTURA
   add constraint FK_FACTURA_PERSONA_F_PERSONA foreign key (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO)
      references PERSONA (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO);

alter table FACTURA
   add constraint FK_FACTURA_RELATIONS_EMPLEADO foreign key (CODEMPLEADO)
      references EMPLEADO (CODEMPLEADO);

alter table FACTURA
   add constraint FK_FACTURA_TIPO_FACT_TIPOFACT foreign key (IDTIPOFAC)
      references TIPOFACTURA (IDTIPOFAC);

alter table HISTORICOPRECIO
   add constraint FK_HISTORIC_PRODUCTO__PRODUCTO foreign key (IDCATPRODUCTO, REFPRODUCTO)
      references PRODUCTO (IDCATPRODUCTO, REFPRODUCTO);

alter table INVENTARIO
   add constraint FK_INVENTAR_INVENTARI_INVENTAR foreign key (INVENTARIOMODIFICADO)
      references INVENTARIO (CONSECINVEN);

alter table INVENTARIO
   add constraint FK_INVENTAR_PRODUCTO__PRODUCTO foreign key (IDCATPRODUCTO, REFPRODUCTO)
      references PRODUCTO (IDCATPRODUCTO, REFPRODUCTO);

alter table INVENTARIO
   add constraint FK_INVENTAR_SOPORTE_DETALLEF foreign key (IDTIPOFAC, NFACTURA, ITEM)
      references DETALLEFACTURA (IDTIPOFAC, NFACTURA, ITEM);

alter table NOMENCLATURA
   add constraint FK_NOMENCLA_COM_COMPONEN foreign key (POSICION)
      references COMPONENTEDIRECC (POSICION);

alter table PERSONA
   add constraint FK_PERSONA_TIPODOC_P_TIPODOC foreign key (IDTIPODOC)
      references TIPODOC (IDTIPODOC);

alter table PERSONA
   add constraint FK_PERSONA_TIPO_PERS_TIPOPERS foreign key (IDTIPOPERSONA)
      references TIPOPERSONA (IDTIPOPERSONA);

alter table PRODUCTO
   add constraint FK_PRODUCTO_CATPROD_P_CATPRODU foreign key (IDCATPRODUCTO)
      references CATPRODUCTO (IDCATPRODUCTO);

