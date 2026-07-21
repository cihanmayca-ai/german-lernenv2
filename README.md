# Almanca Pasaportu — A1 → A2 Hazırlık Sitesi

Sıfırdan başlayıp önce **A1**, sonra **A2** seviyesi için kelime, gramer ve quiz pratiği yapabileceğiniz statik bir web sitesi. Herhangi bir kuruluma gerek yok — sadece HTML/CSS/JavaScript, GitHub Pages'te ücretsiz yayınlanabilir.

## İçerik

- **Kelime Çalış** (`study.html`) — Flashcard (kart) yapısı. Kartın önünde Almanca kelime, tıklayınca (veya boşluk tuşuyla) arkasında Türkçesi görünür. Kategoriye göre filtreleyebilir, öğrendiğiniz kartları "Öğrendim" diye işaretleyebilirsiniz.
- **Kelime Testi** (`vocab.html`) — A1 (337 kelime) ve A2 (223 kelime) kelime listeleri. Almanca kelime gösterilir, siz Türkçesini yazarsınız, doğru/yanlış anında gösterilir. Üstteki kutuyu işaretlerseniz **sadece "Kelime Çalış" sayfasında öğrendim dediğiniz kelimelerle** test olursunuz — yani önce çalışıp sonra o kelimelerle kendinizi sınayabilirsiniz.
- **Gramer** (`grammar.html`) — A1 için 10, A2 için 10 temel konu; açıklama, kural tablosu ve örnek cümlelerle.
- **Quiz** (`quiz.html`) — Sınav formatına benzer, özgün olarak hazırlanmış çoktan seçmeli sorular (20 A1 + 20 A2). **Not:** Bunlar gerçek Goethe/telc sınavlarından alınmış sorular değildir, telif nedeniyle format olarak benzetilmiş özgün alıştırmalardır.
- **İlerleme takibi** — Tarayıcınızın `localStorage`'ında saklanır (öğrenilen kelimeler, quiz skorları, okunan gramer konuları dahil). Yani her kullanıcı (siz ve eşiniz) kendi cihazında/tarayıcısında ayrı ilerleme görür. Sunucu veya hesap yok, tamamen yerel — farklı bir tarayıcı veya gizli sekme kullanırsanız ilerleme sıfırdan başlar.

## Yerelde deneme

Klasörü indirin, içine girin ve basit bir sunucu başlatın (tarayıcı güvenlik kısıtlaması nedeniyle dosyayı doğrudan çift tıklayarak açmak `fetch` ile veri yüklemeyi engelleyebilir):

```bash
cd german-lernen
python3 -m http.server 8000
# sonra tarayıcıda http://localhost:8000 adresini açın
```

veya VS Code kullanıyorsanız "Live Server" eklentisiyle de açabilirsiniz.

## GitHub Pages'e yayınlama (adım adım)

1. GitHub'da yeni bir repo oluşturun (örn. `almanca-pasaportu`), **public** olarak.
2. Bu klasördeki tüm dosyaları o reponun içine kopyalayın (aynı klasör yapısıyla: `index.html`, `css/`, `js/`, `data/` hep repo kök dizininde olmalı).
3. Terminalde:
   ```bash
   cd almanca-pasaportu
   git init
   git add .
   git commit -m "İlk sürüm"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/almanca-pasaportu.git
   git push -u origin main
   ```
4. GitHub'da repo sayfasında **Settings → Pages** bölümüne gidin.
5. "Build and deployment" altında **Source: Deploy from a branch** seçin, **Branch: main / (root)** seçip **Save**'e basın.
6. Birkaç dakika sonra siteniz şu adreste yayında olacak:
   `https://KULLANICI_ADINIZ.github.io/almanca-pasaportu/`
7. Bu linki eşinizle paylaşın — ikiniz de aynı siteyi kullanabilirsiniz, ilerlemeniz kendi tarayıcınızda ayrı ayrı tutulur.

## Genişletme fikirleri (birlikte ekleyebileceğimiz şeyler)

- Kelime listelerine ses telaffuzu (tarayıcının yerleşik `speechSynthesis` API'si ile, ekstra dosya gerekmez).
- Kelime sayısını daha da artırmak (Goethe resmi A1/A2 kelime listesi toplamda ~1300 kelimedir, şu an 560 kelime var).
- Kelime testinde yanlış yapılan kelimeleri otomatik olarak "tekrar çalış" listesine ekleme.
- B1 modülü ekleme.
- Quiz sorularını kendi girdiğiniz çıkmış soru örnekleriyle genişletme.

Bunlardan hangisini önce eklemek istersiniz, birlikte devam edebiliriz.
