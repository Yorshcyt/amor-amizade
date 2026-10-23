# amor&amizade · Guia da cidade

Versão estática do mapa universitário do RPG, pronta para GitHub Pages. Inclui trajetos a pé, de bicicleta, carro, moto e ônibus, zoom e movimentação do mapa. Os cálculos são feitos no navegador, sem servidor de aplicação, serviços pagos ou chaves de API.

## Publicar pelo site do GitHub

1. Entre em https://github.com e crie um repositório em https://github.com/new.
2. Use, por exemplo, o nome `amor-amizade`, selecione **Public** e marque **Add a README file** para iniciar a branch `main`. Clique em **Create repository**.
3. Extraia o ZIP no seu computador. Abra a pasta extraída até enxergar `index.html` e a pasta `assets` juntos.
4. No repositório, abra **Add file → Upload files**. Arraste o conteúdo da pasta extraída: `index.html`, `assets`, `.nojekyll` e este `README.md`. Envie os arquivos e a pasta; não envie o ZIP nem uma pasta externa contendo tudo. Substituir o README inicial pelo deste pacote é esperado. Clique em **Commit changes**.
5. Entre em **Settings → Pages**. Em **Build and deployment**, escolha **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)** e clique em **Save**.
6. Aguarde a publicação e consulte o endereço exibido nessa mesma página. Normalmente terá o formato `https://SEU-USUARIO.github.io/amor-amizade/`.

O arquivo `index.html` e a pasta `assets` precisam aparecer diretamente na raiz do repositório. Não é necessário configurar um domínio personalizado ou um comando de compilação.

## Acesso e uso

Esta publicação no GitHub Pages será pública e não usará a lista de convidados do site anterior. As pessoas poderão abrir o endereço sem conta do ChatGPT. O repositório e os arquivos também serão públicos. A exportação não altera a hospedagem anterior.

Escolhas de trajeto ficam salvas apenas no navegador de cada pessoa. Não há sincronização entre usuários, calendário, bot ou integração com Telegram. Os tempos e distâncias são estimativas para o cenário fictício.

## Se o mapa não aparecer

- Confira se `index.html` e `assets` estão na raiz, sem uma pasta extra entre eles e a raiz do repositório.
- Confira se todos os arquivos de `assets` foram enviados juntos e com os nomes originais.
- Veja se a publicação terminou na aba **Actions** ou se há um erro informado em **Settings → Pages**.
- Abra a URL do site mostrada em **Pages**, em vez do endereço dos arquivos no GitHub.

Abrir o `index.html` com duplo clique no computador pode bloquear os módulos JavaScript; use o site publicado para testar.

## Arquivos

- `index.html`: página.
- `assets/app.css`: aparência e layout.
- `assets/app.mjs`: interações e zoom.
- `assets/city-data.mjs`: locais, vias e transportes.
- `assets/router.mjs`: rotas e estimativas.
- `assets/cidade.webp`: imagem do mapa.
- `.nojekyll`: publicação direta dos arquivos estáticos.

Os caminhos relativos já funcionam quando o site está em uma subpasta como `/amor-amizade/`.

Instruções oficiais: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
