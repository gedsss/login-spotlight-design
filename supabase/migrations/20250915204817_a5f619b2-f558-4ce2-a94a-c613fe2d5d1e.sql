-- Insert sample donations
INSERT INTO public.donations (donor_name, amount, transaction_hash, created_at) VALUES
  ('João Silva', 150.5, 'abc123def456ghi789jkl012mno345pqr678', NOW() - INTERVAL '1 hour'),
  ('Maria Santos', 75.25, 'xyz987wvu654tsr321poi098lkj765ihg432', NOW() - INTERVAL '2 hours'),
  ('Pedro Costa', 300.0, 'qwe456rty789uio012asd345fgh678jkl901', NOW() - INTERVAL '1 day'),
  ('Ana Lima', 120.75, 'zxc234vbn567mnb890qwe123asd456fgh789', NOW() - INTERVAL '2 days'),
  ('Carlos Pereira', 200.0, 'poi098lkj765ihg432mnb567vbn234zxc890', NOW() - INTERVAL '3 days'),
  ('Fernanda Oliveira', 85.5, 'asd123fgh456jkl789poi012lkj345ihg678', NOW() - INTERVAL '4 days'),
  ('Roberto Santos', 500.25, 'mnb890vbn567zxc234qwe789asd456fgh123', NOW() - INTERVAL '1 week'),
  ('Juliana Costa', 90.0, 'ihg678jkl901poi234lkj567ihg890mnb123', NOW() - INTERVAL '1 week'),
  ('Pedro Costa', 250.75, 'fgh456jkl789poi012asd345fgh678jkl901', NOW() - INTERVAL '10 days'),
  ('João Silva', 125.0, 'vbn567zxc890qwe123asd456fgh789jkl012', NOW() - INTERVAL '2 weeks'),
  ('Maria Santos', 180.5, 'jkl901poi234lkj567ihg890mnb123vbn456', NOW() - INTERVAL '2 weeks'),
  ('Eduardo Ferreira', 95.25, 'qwe789asd012fgh345jkl678poi901lkj234', NOW() - INTERVAL '3 weeks'),
  ('Beatriz Almeida', 110.0, 'asd456fgh789jkl012poi345lkj678ihg901', NOW() - INTERVAL '1 month'),
  ('Ricardo Souza', 65.75, 'zxc890qwe123asd456fgh789jkl012poi345', NOW() - INTERVAL '1 month'),
  ('Camila Rodrigues', 275.0, 'poi234lkj567ihg890mnb123vbn456zxc789', NOW() - INTERVAL '1 month');