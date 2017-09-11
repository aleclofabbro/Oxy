#TODO:
  - lens
    - rivedere le lens per gestire anche arrays : https://github.com/ramda/ramda/issues/1332#issuecomment-130517662
      - definire la lens:
        - lens(prop,assoc) per Object s
        - lensIndex() per Array s
      - passare al descendant la lens oltre al path e per la creazione della lens applicare compose(parent_lens, local_lens)
  - si può mettere il proxy-target al valore corretto?
