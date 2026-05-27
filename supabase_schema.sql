create table if not exists ligas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  pais text,
  api_league_id int,
  ativo boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists jogos (
  id uuid primary key default gen_random_uuid(),
  api_fixture_id int unique,
  liga_id uuid references ligas(id),
  time_casa text not null,
  time_fora text not null,
  data_jogo date,
  horario text,
  status text default 'agendado',
  gols_casa int,
  gols_fora int,
  created_at timestamp with time zone default now()
);

create table if not exists analises (
  id uuid primary key default gen_random_uuid(),
  jogo_id uuid references jogos(id),
  mercado_sugerido text,
  odd numeric(6,2),
  nota numeric(4,2),
  status_confianca text,
  resumo_ia text,
  risco text,
  media_gols numeric(5,2),
  over_05_casa text,
  over_05_fora text,
  over_15_casa text,
  over_15_fora text,
  h2h_over_05 text,
  created_at timestamp with time zone default now()
);

create table if not exists bilhetes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('IA', 'Manual')),
  nome text not null,
  data date default current_date,
  odd_total numeric(8,2),
  stake numeric(10,2) default 100,
  status text default 'em_andamento' check (status in ('em_andamento', 'green', 'red', 'cancelado')),
  lucro_prejuizo numeric(10,2) default 0,
  created_at timestamp with time zone default now()
);

create table if not exists bilhete_selecoes (
  id uuid primary key default gen_random_uuid(),
  bilhete_id uuid references bilhetes(id) on delete cascade,
  jogo_id uuid references jogos(id),
  jogo_manual text,
  mercado text not null,
  odd numeric(8,2),
  nota numeric(4,2),
  resultado text default 'pendente',
  acertou boolean,
  created_at timestamp with time zone default now()
);

create table if not exists configuracoes (
  id uuid primary key default gen_random_uuid(),
  nota_minima numeric(4,2) default 8.5,
  odd_alvo numeric(8,2) default 1.60,
  stake_padrao numeric(10,2) default 100,
  quantidade_jogos_multipla int default 5,
  created_at timestamp with time zone default now()
);

insert into configuracoes (nota_minima, odd_alvo, stake_padrao, quantidade_jogos_multipla)
select 8.5, 1.60, 100, 5
where not exists (select 1 from configuracoes);
