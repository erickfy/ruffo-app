```sql
insert into public.clients (full_name, phone, email, notes)
values
  ('María Pérez', '0991111111', 'maria@example.com', 'Cliente frecuente'),
  ('Juan Torres', '0982222222', 'juan@example.com', 'Prefiere contacto por WhatsApp');
```

```sql
insert into public.pets (client_id, name, species, breed, behavior_notes)
select id, 'Luna', 'canino', 'Poodle', 'Nerviosa al inicio'
from public.clients
where full_name = 'María Pérez';

insert into public.pets (client_id, name, species, breed, behavior_notes)
select id, 'Milo', 'felino', 'Mestizo', 'Tranquilo'
from public.clients
where full_name = 'Juan Torres';
```
