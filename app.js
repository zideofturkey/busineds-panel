/**
 * Busined's — Ön Yüz Mantığı
 */

let state = {
  db: null,
  findingFilter: 'all',
  findingAccountFilter: 'all',
  findingCategoryFilter: 'all',
  findingTimeFilter: 'all',
  accountFilter: 'all',
  activeDetailAccountId: null,
  detailRange: '5d'
};

const MCC_SCRIPT_SNIPPET = `// Busined's Google Ads MCC Veri Köprüsü
const IGNORED_IDS = ['999-888-7710']; // Yıldız Spot vb.

function main() {
  const accounts = AdsManagerApp.accounts().get();
  while (accounts.hasNext()) {
    const acc = accounts.next();
    if (IGNORED_IDS.indexOf(acc.getCustomerId()) !== -1) continue;
    AdsManagerApp.select(acc);
    const stats = acc.getStatsFor('LAST_7_DAYS');
    Logger.log(acc.getName() + ' | Harcama: ' + stats.getCost() + ' TL | Dönüşüm: ' + stats.getConversions());
  }
}`;

const CLAUDE_PROMPT_TEMPLATE = `Merhaba Claude. Türkiye'de yönettiğim Google Ads hesaplarını denetlemek için "Busined's" adında otonom bir yapay zeka denetim sistemi kullanıyorum.

Şu an açık olan Google Ads hesabını derinlemesine incelemeni ve Busined's sistemindeki yapay zekanın "elma ile armudu karıştırmaması" (örneğin Mağaza Ziyareti/Yol Tarifi üreten PMax kampanyasıyla doğrudan Telefon/Form Lead'i üreten Arama kampanyasını aynı kefeye koymaması veya ana form dönüşümünü ikincil sanmaması) için bu hesabın "Stratejik Anayasasını" birlikte çıkarmamızı istiyorum.

⚠️ ÇOK ÖNEMLİ KURAL: KESİNLİKLE İLK MESAJINDA JSON ÜRETME! KÖRÜ KÖRÜNE VARSAYIM YAPMA!
Aşağıdaki 3 aşamalı etkileşimli protokolü harfiyen uygula:

====================================================================
AŞAMA 1 — DERİN KEŞİF (Önce Hesabı Gez ve Somut Verileri Çıkar)
====================================================================
Tarayıcı üzerinden şu ekranları/verileri kontrol et:
1. Hesap Kimliği: Hesap Adı, 10 haneli Müşteri ID (XXX-XXX-XXXX) ve Optimizasyon Puanı.
2. Kampanya Mimarisi (PMax & Arama):
   - Hangi aktif kampanyalar var? Günlük bütçeleri ve Teklif Stratejileri (Hedef EBM / Maks. Dönüşüm / TBM) ne?
   - ÇOK KRİTİK: Hangi kampanya hangi dönüşüm türünü üretiyor? (Örn: PMax kampanyası "Yol Tarifi / Mağazaya Gidiş" mi üretiyor, yoksa Arama kampanyası "Form / WhatsApp / Telefon" mu üretiyor?)
   - Yer (Lokasyon) seçeneklerinde "Yalnızca hedeflenen konumdaki kişiler (Presence)" mi seçili yoksa "İlgi gösterenler (Presence or Interest)" sızıntısı var mı?
3. Dönüşüm Kurulumu (Conversions):
   - Hangi dönüşüm aksiyonları "Birincil (Primary)", hangileri "İkincil (Secondary)"?
   - Sayım türü (Count) "Bir (One)" mi yoksa "Her (Every)" mi? (Lead hesaplarında "Her" seçiliyse uyar).
4. Rekabet, Kalite & Arama Terimleri:
   - Gösterim Payı, Bütçe Kaybı, Sıralama Kaybı (Rank Lost IS), Üst Sıra (%Top) ve Mutlak 1. Sıra (%Abs Top) oranları ne?
   - Arama terimlerinde rakip markalar, yanlış ilçeler veya yanlış niyetli kelimeler (örn. eşya alımı yerine "eşya satanlar") var mı?

====================================================================
AŞAMA 2 — BANA SORACAĞIN ZORUNLU STRATEJİK NÜANS SORULARI
====================================================================
İlk mesajında; Aşama 1'de gördüğün tabloyu bana kısaca özetle ve JSON üretmeden önce şu 5 nüansı bana sorup cevabımı bekle:

1. [Dönüşüm Hiyerarşisi / Kuzey Yıldızı]: "Hesapta şu dönüşümleri görüyorum: [...]. Bu firma için asıl para kazandıran 1 numaralı ana dönüşüm (ör. Form Doldurma / Yeni Fiyat Ekranı mı, Telefon mu, WhatsApp mı) hangisi? Hangileri sadece yan/mikro sinyal?"
2. [Kampanya Rolleri & Elma-Armut Ayrımı]: "Kampanyaların ürettiği dönüşümlere baktığımda [...]. Bu kampanyaların her birinin senin stratejindeki özel rolü nedir? (Örn: PMax kreatif/harita görünürlüğü için mi, Arama doğrudan sıcak müşteri için mi? Hangi iki kampanyayı EBM bazında birbiriyle ASLA kıyaslamamalıyız?)"
3. [Görünürlük vs. Hacim Felsefesi]: "Bu hesapta Google'da en üst sırada (Mutlak 1. Sıra) görünmek mi bizim için kritik, yoksa sıra önemli değil sadece hedef EBM altında maksimum dönüşüm sayısı toplamak mı?"
4. [Rakip & Arama Niyeti Politikası]: "Arama terimlerinde şu dikkatimi çekti: [...]. Rakip firma isimlerinde veya belirli kelimelerde görünmek bilinçli bir tercih mi, yoksa negatiflenmeli mi?"
5. [Hedef EBM & Kırmızı Çizgiler]: "Bu hesap için kabul ettiğin gerçek maksimum Hedef EBM (CPA) kaç TL? Kesinlikle reklam çıkılmaması gereken ilçe, saat dilimi veya müşteri profili var mı?"

====================================================================
AŞAMA 3 — BEN CEVAP VERDİKTEN SONRA ÜRETECEĞİN JSON ÇIKTISI
====================================================================
Ben yukarıdaki sorularına cevap verdikten sonra, tüm tespitlerini ve benim stratejik yanıtlarımı birleştirerek Busined's paneline doğrudan yapıştırabileceğim şu JSON formatında TEK BİR KOD BLOĞU üret:

{
  "name": "Firma / Hesap Adı",
  "customerId": "XXX-XXX-XXXX",
  "sector": "Sektör ve İş Modeli (Örn: 2. El Araç Nakit Alım / Spot Eşya Alım)",
  "location": "Hedeflenen İl ve İlçeler",
  "activeCampaigns": 3,
  "primaryGoal": "Gerçek Kuzey Yıldızı Dönüşüm (Örn: Yeni Fiyat Ekranı Formu / Telefon Çağrısı)",
  "targetCpaTl": 25,
  "currentCpaTl": 20,
  "customRules": "Yapay zeka denetçisinin ASLA unutmaması gereken tüm stratejik kurallar, dönüşüm önceliği, kampanya rolleri, negatiflenecek temalar ve lokasyon/saat sınırları (Tek paragraf halinde net özet).",
  "strategyProfile": {
    "northStarConversion": "Asıl değerli olan birincil dönüşüm ve neden önemli olduğu",
    "secondaryConversions": "İkincil veya farklı amaçlı dönüşümler (Örn: Yol tarifi vb.)",
    "campaignRoles": "Hangi kampanyanın ne amaçla çalıştığı ve hangi kampanyaların birbiriyle kıyaslanmaması gerektiği",
    "visibilityVsVolume": "Üst sıra (Abs Top IS) mı öncelikli, düşük EBM ile maksimum dönüşüm hacmi mi, yoksa PMax kreatif erişim mi?",
    "competitorAndKeywordPolicy": "Rakip kelimeler ve arama niyeti filtreleri hakkındaki kural",
    "redLines": "Asla aşılmaması gereken EBM, lokasyon ve mesai saati sınırları"
  },
  "findings": [
    {
      "severity": "critical",
      "category": "Kategori",
      "title": "Senin stratejine %100 uyumlu ilk bulgu başlığı",
      "detail": "Hesaptaki gerçek rakamlara ve senin kurallarına dayanan net tespit",
      "action": "Uygulanacak somut aksiyon"
    }
  ]
}`;

const GITHUB_REPO = 'zideofturkey/busineds';
const GITHUB_DATA_FILE = 'data/accounts.json';

function isLocalhost() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

function getStoredToken() {
  return localStorage.getItem('busineds_gh_token') || '';
}

function getStoredVaultPassword() {
  return localStorage.getItem('busineds_vault_pw') || '';
}

function base64ToUint8(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function uint8ToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

async function deriveAesKeyBrowser(password, saltBytes, iterations = 600000) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function decryptVaultBrowser(vaultObj, password) {
  if (!vaultObj || !vaultObj.businedsVault) return vaultObj;
  const salt = base64ToUint8(vaultObj.salt);
  const iv = base64ToUint8(vaultObj.iv);
  const combined = base64ToUint8(vaultObj.ciphertext);
  const key = await deriveAesKeyBrowser(password, salt, vaultObj.iterations || 600000);
  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    combined
  );
  const decText = new TextDecoder().decode(decryptedBuf);
  return JSON.parse(decText);
}

async function encryptVaultBrowser(plainObj, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKeyBrowser(password, salt, 600000);
  const plainBytes = new TextEncoder().encode(JSON.stringify(plainObj));
  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plainBytes
  );
  return {
    businedsVault: true,
    version: 1,
    algo: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256',
    iterations: 600000,
    updatedAt: new Date().toISOString(),
    salt: uint8ToBase64(salt),
    iv: uint8ToBase64(iv),
    ciphertext: uint8ToBase64(new Uint8Array(encryptedBuf))
  };
}

function promptVaultUnlock(vaultObj) {
  return new Promise(resolve => {
    const modal = document.getElementById('vaultModal');
    const form = document.getElementById('vaultForm');
    const input = document.getElementById('vaultPasswordInput');
    const errBox = document.getElementById('vaultErrorMsg');
    modal.classList.remove('hidden');
    errBox.style.display = 'none';
    input.value = '';
    input.focus();

    const handler = async (e) => {
      e.preventDefault();
      const pw = input.value.trim();
      if (!pw) return;
      try {
        const decrypted = await decryptVaultBrowser(vaultObj, pw);
        localStorage.setItem('busineds_vault_pw', pw);
        modal.classList.add('hidden');
        form.removeEventListener('submit', handler);
        resolve(decrypted);
      } catch (err) {
        errBox.style.display = 'block';
      }
    };
    form.addEventListener('submit', handler);
  });
}

async function saveDbToGitHub(updatedDb, commitMessage) {
  const token = getStoredToken();
  if (!token) {
    alert('Bulut panel üzerinden değişiklik kaydetmek için sağ üstteki "Ayarlar & Script" menüsünden GitHub Token (ghp_...) bilginizi bir kez girin.');
    return false;
  }
  // Repo artık tamamen PRIVATE olduğu için doğrudan temiz JSON kaydedilir (eski tarayıcı şifreleme anahtarı varsa temizle)
  localStorage.removeItem('busineds_vault_pw');
  const payloadToSave = updatedDb;

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_DATA_FILE}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };
  const getRes = await fetch(`${apiUrl}?ref=main&t=${Date.now()}`, { headers });
  if (!getRes.ok) {
    alert('GitHub erişim hatası. Token bilginizi kontrol edin.');
    return false;
  }
  const fileInfo = await getRes.json();
  const jsonStr = JSON.stringify(payloadToSave, null, 2);
  const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: commitMessage || 'chore: update via Busineds web panel',
      content: base64Content,
      sha: fileInfo.sha,
      branch: 'main'
    })
  });
  return putRes.ok;
}

async function fetchPrivateRepoDb(token) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_DATA_FILE}?ref=main&t=${Date.now()}`;
  const res = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.raw+json'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function promptPrivateRepoToken() {
  return new Promise(resolve => {
    const modal = document.getElementById('vaultModal');
    const form = document.getElementById('vaultForm');
    const input = document.getElementById('vaultPasswordInput');
    const errBox = document.getElementById('vaultErrorMsg');
    modal.classList.remove('hidden');
    errBox.style.display = 'none';
    input.value = '';
    input.focus();

    const handler = async (e) => {
      e.preventDefault();
      const token = input.value.trim();
      if (!token) return;
      try {
        const dbData = await fetchPrivateRepoDb(token);
        localStorage.setItem('busineds_gh_token', token);
        modal.classList.add('hidden');
        form.removeEventListener('submit', handler);
        resolve(dbData);
      } catch (err) {
        errBox.style.display = 'block';
      }
    };
    form.addEventListener('submit', handler);
  });
}

async function loadData() {
  if (isLocalhost()) {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        state.db = await res.json();
        populateFilterDropdowns();
        renderAll();
        return;
      }
    } catch (e) {}
  }

  // Online modda Private repo verisini kullanıcının GitHub Token'ı ile çek
  const token = getStoredToken();
  let payload = null;
  if (token) {
    try {
      payload = await fetchPrivateRepoDb(token);
    } catch (e) {
      localStorage.removeItem('busineds_gh_token');
    }
  }
  if (!payload) {
    payload = await promptPrivateRepoToken();
  }

  if (payload && payload.businedsVault) {
    const savedPw = getStoredVaultPassword();
    if (savedPw) {
      try {
        state.db = await decryptVaultBrowser(payload, savedPw);
        populateFilterDropdowns();
        renderAll();
        return;
      } catch (e) {
        localStorage.removeItem('busineds_vault_pw');
      }
    }
    state.db = await promptVaultUnlock(payload);
  } else {
    state.db = payload;
  }
  populateFilterDropdowns();
  renderAll();
}

function formatTl(num) {
  return '₺' + Math.round(Number(num || 0)).toLocaleString('tr-TR');
}

function populateFilterDropdowns() {
  if (!state.db) return;
  const accSelect = document.getElementById('filterAccountSelect');
  const catSelect = document.getElementById('filterCategorySelect');
  const timeSelect = document.getElementById('filterTimeSelect');

  const currentAcc = state.findingAccountFilter;
  const currentCat = state.findingCategoryFilter;
  const currentTime = state.findingTimeFilter || 'all';

  const approved = state.db.accounts.filter(a => a.approved);
  accSelect.innerHTML = `<option value="all">Tüm Hesaplar (${approved.length})</option>` +
    approved.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

  const categories = new Set();
  const dateCounts = {};
  const fallbackStamp = state.db.settings?.lastAuditDate || state.db.settings?.lastSyncDate;

  approved.forEach(a => {
    (a.findings || []).forEach(f => {
      if (f.category) categories.add(f.category);
      const rawDate = f.createdAt || fallbackStamp;
      if (rawDate) {
        const dayKey = new Date(rawDate).toISOString().slice(0, 10);
        dateCounts[dayKey] = (dateCounts[dayKey] || 0) + 1;
      }
    });
  });

  catSelect.innerHTML = `<option value="all">Tüm Konular</option>` +
    Array.from(categories).map(c => `<option value="${c}">${c}</option>`).join('');

  if (timeSelect) {
    const sortedDays = Object.keys(dateCounts).sort((a, b) => b.localeCompare(a));
    const dateOptionsHtml = sortedDays.length > 0
      ? `<optgroup label="Denetim Tarihine Göre">` +
        sortedDays.map(dayKey => {
          const dLabel = new Date(dayKey + 'T12:00:00').toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
          return `<option value="date:${dayKey}">📅 ${dLabel} (${dateCounts[dayKey]} Bulgu)</option>`;
        }).join('') +
        `</optgroup>`
      : '';

    timeSelect.innerHTML = `
      <option value="all">Tüm Zamanlar</option>
      <optgroup label="Zaman Aralığına Göre">
        <option value="today">Son 24 Saat (Bugün)</option>
        <option value="3d">Son 3 Gün</option>
        <option value="5d">Son 5 Gün</option>
        <option value="7d">Son 7 Gün</option>
        <option value="14d">Son 14 Gün</option>
        <option value="30d">Son 30 Gün</option>
      </optgroup>
      ${dateOptionsHtml}
    `;
    timeSelect.value = Array.from(timeSelect.options).some(o => o.value === currentTime) ? currentTime : 'all';
  }

  accSelect.value = currentAcc;
  catSelect.value = currentCat;
}

function renderAll() {
  if (!state.db) return;
  renderHeaderAndKpis();
  renderFindings();
  renderAccounts();
  renderArchive();
  renderIgnored();
  if (state.activeDetailAccountId) {
    renderAccountDetailModal(state.activeDetailAccountId);
  }
}

function renderHeaderAndKpis() {
  const { settings, accounts } = state.db;
  const approved = accounts.filter(a => a.approved);
  const pending = accounts.filter(a => !a.approved);

  const syncStamp = settings.lastSyncDate || settings.lastAuditDate;
  const syncStr = syncStamp
    ? new Date(syncStamp).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';
  const auditStr = settings.lastAuditDate
    ? new Date(settings.lastAuditDate).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  document.getElementById('lastAuditLabel').textContent = `SON VERİ: ${syncStr.toUpperCase()} · SON 5G RAPOR: ${auditStr.toUpperCase()}`;
  document.getElementById('aiModelBadge').textContent = (settings.aiModel || 'gemini-2.5-flash').toUpperCase();

  let criticals = 0;
  let warnings = 0;
  let totalSpend = 0;
  let totalConv = 0;

  approved.forEach(acc => {
    totalSpend += Number(acc.spend5dTl || 0);
    totalConv += Number(acc.conversions5d || 0);
    (acc.findings || []).forEach(f => {
      if (f.severity === 'critical') criticals++;
      else warnings++;
    });
  });

  document.getElementById('kpiApprovedCount').textContent = approved.length;
  document.getElementById('kpiPendingNote').textContent = `/ ${accounts.length} Bağlı (${pending.length} Pasif)`;
  document.getElementById('kpiCriticalCount').textContent = criticals;
  document.getElementById('kpiWarningCount').textContent = warnings;
  document.getElementById('kpiTotalSpend').textContent = formatTl(totalSpend);
  document.getElementById('kpiTotalConv').textContent = `${totalConv} Dönüşüm`;
}

function formatFindingDate(isoStr) {
  const stamp = isoStr || (state.db && state.db.settings && (state.db.settings.lastAuditDate || state.db.settings.lastSyncDate));
  if (!stamp) return '—';
  const d = new Date(stamp);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getRecentFindingsHistory() {
  const history = Array.isArray(state.db?.findingsHistory) ? state.db.findingsHistory : [];
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  return history.filter(item => {
    const ts = new Date(item.resolvedAt || item.createdAt || Date.now()).getTime();
    return (Date.now() - ts) < ninetyDaysMs;
  });
}

const COMPLETED_PRESETS = [
  'Önerilen aksiyonu birebir uyguladım',
  'Hedef EBM (tCPA) veya Maks. TBM teklifini güncelledim',
  'Negatif anahtar kelime / eşleşme türü düzenlemesi yaptım',
  'Günlük bütçe veya konum / yarıçap ayarlarını değiştirdim',
  'Reklam metnini / PMax öğe grubunu veya politika kısıtını düzelttim',
  'Dönüşüm sayım (Bir/Her) veya birincil hedef ayarını düzelttim'
];

const DISMISSED_PRESETS = [
  'Bilinçli stratejik tercih — şimdilik dokunulmayacak',
  'Müşteri talebi / bütçe sınırı nedeniyle sabit tutuluyor',
  'Mevcut dönüşüm maliyeti ve hacmi bizim için yeterli',
  'Bu öneri hesabın iş modeline / kampanya amacına uygun değil',
  'Daha önce denendi, verim alınmadığı için eski ayara dönüldü'
];

let pendingResolutionContext = null;

function openFindingResolutionModal(accountId, findingIndex, findingId, newStatus) {
  const acc = state.db.accounts.find(a => a.id === accountId);
  if (!acc || !Array.isArray(acc.findings)) return;
  const idx = findingId
    ? acc.findings.findIndex(f => f.id === findingId)
    : Number(findingIndex);
  const targetIdx = idx !== -1 ? idx : Number(findingIndex);
  const finding = acc.findings[targetIdx];
  if (!finding) return;

  pendingResolutionContext = { accountId, findingIndex: targetIdx, findingId: finding.id, newStatus };

  const modal = document.getElementById('findingResolutionModal');
  const badge = document.getElementById('resModalBadge');
  const title = document.getElementById('resModalTitle');
  const findingTitleBox = document.getElementById('resModalFindingTitle');
  const optionsLabel = document.getElementById('resOptionsLabel');
  const optionsList = document.getElementById('resolutionOptionsList');
  const reopenGroup = document.getElementById('resReopenGroup');
  const noteLabel = document.getElementById('resNoteLabel');
  const noteInput = document.getElementById('resolutionNoteInput');

  const isComplete = newStatus === 'completed';
  badge.textContent = isComplete ? `${acc.name.toUpperCase()} · TAMAMLANDI KAYDI` : `${acc.name.toUpperCase()} · YOKSAY / ERTELE KAYDI`;
  title.textContent = isComplete ? '✓ Hangi Aksiyonu Uyguladınız?' : '✕ Neden Yoksayıldı / Ertelendi?';
  findingTitleBox.textContent = finding.title;
  optionsLabel.textContent = isComplete
    ? 'Yaptığınız İşlemi Seçin (Sistem sonraki denetimlerde etkisini takip eder)'
    : 'Yoksayma Sebebini Seçin (Sistem kararınıza saygı duyar)';
  noteLabel.textContent = isComplete
    ? '+1 Serbest Metin: Tam olarak ne değiştirdiniz? (Opsiyonel)'
    : '+1 Serbest Metin: Neden yoksayıldı veya özel koşulunuz nedir? (Opsiyonel)';
  noteInput.value = '';
  noteInput.placeholder = isComplete
    ? 'Örn: Maks. TBM sınırını 15 TL\'den 20 TL\'ye çıkardım, 3 gün izlenecek...'
    : 'Örn: İşletme sahibi bütçeyi şimdilik artırmak istemiyor, günlük dönüşüm 20\'nin altına inmedikçe uyarma...';

  if (isComplete) {
    reopenGroup.classList.add('hidden');
  } else {
    reopenGroup.classList.remove('hidden');
    document.getElementById('resolutionReopenSelect').value = 'auto_threshold';
  }

  const presets = isComplete ? COMPLETED_PRESETS : DISMISSED_PRESETS;
  optionsList.innerHTML = presets.map((opt, i) => `
    <label style="display:flex; align-items:center; gap:0.55rem; padding:0.48rem 0.65rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:6px; cursor:pointer; font-size:0.82rem;">
      <input type="radio" name="resolutionReasonRadio" value="${opt.replace(/"/g, '&quot;')}" ${i === 0 ? 'checked' : ''} style="accent-color:var(--crimson);" />
      <span>${opt}</span>
    </label>
  `).join('');

  modal.classList.remove('hidden');
}

async function markFindingStatus(accountId, findingIndex, findingId, newStatus, resolutionMeta = null) {
  // Tamamlandı veya Yoksay tıklandığında önce sebep & serbest metin penceresini aç
  if ((newStatus === 'completed' || newStatus === 'dismissed') && !resolutionMeta) {
    openFindingResolutionModal(accountId, findingIndex, findingId, newStatus);
    return;
  }

  const resolutionReason = resolutionMeta?.resolutionReason || null;
  const resolutionNote = resolutionMeta?.resolutionNote || null;
  const reopenIf = resolutionMeta?.reopenIf || (newStatus === 'dismissed' ? 'auto_threshold' : null);

  if (isLocalhost()) {
    const res = await fetch('/api/findings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, findingIndex, findingId, newStatus, resolutionReason, resolutionNote, reopenIf })
    });
    const data = await res.json();
    if (data.db) {
      state.db = data.db;
      renderAll();
    }
    return;
  }

  state.db.findingsHistory = getRecentFindingsHistory();

  if (newStatus === 'active') {
    const histIdx = state.db.findingsHistory.findIndex(f => f.id === findingId);
    if (histIdx === -1) return;
    const restored = state.db.findingsHistory.splice(histIdx, 1)[0];
    const acc = state.db.accounts.find(a => a.id === restored.accountId);
    if (acc) {
      acc.findings = acc.findings || [];
      acc.findings.unshift({
        id: restored.id,
        severity: restored.severity,
        category: restored.category,
        title: restored.title,
        detail: restored.detail,
        action: restored.action,
        createdAt: restored.createdAt,
        status: 'active'
      });
    }
  } else {
    const acc = state.db.accounts.find(a => a.id === accountId);
    if (!acc || !Array.isArray(acc.findings)) return;
    const idx = findingId
      ? acc.findings.findIndex(f => f.id === findingId)
      : Number(findingIndex);
    const targetIdx = idx !== -1 ? idx : Number(findingIndex);
    if (isNaN(targetIdx) || !acc.findings[targetIdx]) return;

    const removed = acc.findings.splice(targetIdx, 1)[0];
    const snoozeUntil = reopenIf === 'never_30d'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;
    state.db.findingsHistory.unshift({
      ...removed,
      id: removed.id || `f-${acc.id}-${Date.now()}`,
      accountId: acc.id,
      accountName: acc.name,
      accountSector: acc.sector,
      customerId: acc.customerId,
      createdAt: removed.createdAt || state.db.settings?.lastAuditDate || new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
      resolvedStatus: newStatus,
      resolutionReason: resolutionReason,
      resolutionNote: resolutionNote,
      reopenIf: reopenIf,
      snoozeUntil: snoozeUntil,
      metricsSnapshot: {
        capturedAt: new Date().toISOString(),
        spend5dTl: acc.spend5dTl ?? 0,
        conversions5d: acc.conversions5d ?? 0,
        leadConversions5d: acc.leadConversions5d ?? acc.conversions5d ?? 0,
        mapConversions5d: acc.mapConversions5d ?? 0,
        currentCpaTl: acc.currentCpaTl ?? null,
        leadCpaTl: acc.leadCpaTl ?? acc.currentCpaTl ?? null,
        targetCpaTl: acc.targetCpaTl ?? null,
        impressionSharePercent: acc.impressionSharePercent ?? null,
        budgetLostSharePercent: acc.budgetLostSharePercent ?? null,
        rankLostSharePercent: acc.rankLostSharePercent ?? null,
        absTopImpPercent: acc.absTopImpPercent ?? null,
        campaigns: (acc.campaigns || []).map(c => ({
          name: c.name,
          status: c.status,
          primaryStatus: c.primaryStatus,
          dailyBudgetTl: c.dailyBudgetTl,
          targetCpaTl: c.targetCpaTl,
          spend5d: c.spend5d,
          conversions5d: c.conversions5d,
          impressions5d: c.impressions5d
        }))
      }
    });
  }

  renderAll();
  await saveDbToGitHub(state.db, `chore: update finding status (${newStatus})`);
}

function renderFindings() {
  const container = document.getElementById('findingsLedger');
  const approved = state.db.accounts.filter(a => a.approved);
  const historyList = getRecentFindingsHistory();

  const completedItems = historyList.filter(f => f.resolvedStatus === 'completed');
  const dismissedItems = historyList.filter(f => f.resolvedStatus === 'dismissed');

  const tabCompleted = document.getElementById('tabCompletedFindings');
  const tabDismissed = document.getElementById('tabDismissedFindings');
  if (tabCompleted) tabCompleted.textContent = `Tamamlanan (${completedItems.length})`;
  if (tabDismissed) tabDismissed.textContent = `Yoksayılan (${dismissedItems.length})`;

  const isHistoryView = state.findingFilter === 'completed' || state.findingFilter === 'dismissed';

  let sourceList = [];
  if (isHistoryView) {
    sourceList = state.findingFilter === 'completed' ? completedItems : dismissedItems;
  } else {
    approved.forEach(acc => {
      (acc.findings || []).forEach((f, idx) => {
        sourceList.push({
          ...f,
          findingIndex: idx,
          accountId: acc.id,
          accountName: acc.name,
          accountSector: acc.sector,
          customerId: acc.customerId
        });
      });
    });
    const order = { critical: 1, warning: 2, suggestion: 3 };
    sourceList.sort((a, b) => (order[a.severity] || 9) - (order[b.severity] || 9));
  }

  const nowMs = Date.now();
  const fallbackStamp = state.db.settings?.lastAuditDate || state.db.settings?.lastSyncDate;

  const filtered = sourceList.filter(f => {
    if (!isHistoryView && state.findingFilter !== 'all' && f.severity !== state.findingFilter) return false;
    if (state.findingAccountFilter !== 'all' && f.accountId !== state.findingAccountFilter) return false;
    if (state.findingCategoryFilter !== 'all' && f.category !== state.findingCategoryFilter) return false;

    if (state.findingTimeFilter && state.findingTimeFilter !== 'all') {
      const targetStamp = isHistoryView ? (f.resolvedAt || f.createdAt || fallbackStamp) : (f.createdAt || fallbackStamp);
      if (!targetStamp) return false;
      const fDate = new Date(targetStamp);
      const ageDays = (nowMs - fDate.getTime()) / (1000 * 60 * 60 * 24);

      if (state.findingTimeFilter.startsWith('date:')) {
        const wantDay = state.findingTimeFilter.slice(5);
        const fDay = fDate.toISOString().slice(0, 10);
        if (fDay !== wantDay) return false;
      } else if (state.findingTimeFilter === 'today' && ageDays > 1.1) {
        return false;
      } else if (state.findingTimeFilter === '3d' && ageDays > 3.1) {
        return false;
      } else if (state.findingTimeFilter === '5d' && ageDays > 5.1) {
        return false;
      } else if (state.findingTimeFilter === '7d' && ageDays > 7.1) {
        return false;
      } else if (state.findingTimeFilter === '14d' && ageDays > 14.1) {
        return false;
      } else if (state.findingTimeFilter === '30d' && ageDays > 30.1) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    const emptyMsg = isHistoryView
      ? (state.findingFilter === 'completed'
          ? 'Son 30 gün içinde tamamlandı olarak işaretlenen öneri kartı bulunmuyor.'
          : 'Son 30 gün içinde yoksayılan öneri kartı bulunmuyor.')
      : 'Seçili filtrelere uygun aktif bulgu yok.';
    container.innerHTML = `<div class="finding-row"><div class="finding-detail">${emptyMsg}</div></div>`;
    return;
  }

  const badgeLabels = {
    critical: 'KRİTİK',
    warning: 'UYARI',
    suggestion: 'ÖNERİ'
  };

  container.innerHTML = filtered.map(f => {
    const createdStr = formatFindingDate(f.createdAt);
    const resolvedStr = f.resolvedAt ? formatFindingDate(f.resolvedAt) : '';
    const safeId = (f.id || '').replace(/'/g, "\\'");

    const topBarRight = isHistoryView
      ? `<div class="finding-quick-actions">
           <span class="finding-timestamp" style="color:var(--emerald);">
             ${f.resolvedStatus === 'completed' ? '✓ TAMAMLANDI:' : '✕ YOKSAYILDI:'} ${resolvedStr} (30G Saklanır)
           </span>
           <button class="finding-act-btn" onclick="markFindingStatus('${f.accountId}', -1, '${safeId}', 'active')" title="Tekrar aktif önerilere geri taşı">↺ Geri Al</button>
         </div>`
      : `<div class="finding-quick-actions">
           <button class="finding-act-btn complete" onclick="markFindingStatus('${f.accountId}', ${f.findingIndex}, '${safeId}', 'completed')" title="Tamamlandı olarak işaretle (30 gün Tamamlanan sekmesinde saklanır)">✓ Tamamlandı</button>
           <button class="finding-act-btn dismiss" onclick="markFindingStatus('${f.accountId}', ${f.findingIndex}, '${safeId}', 'dismissed')" title="Yoksay (30 gün Yoksayılan sekmesinde saklanır)">✕ Yoksay</button>
         </div>`;

    const relatedBadge = f.relatedHistoryTitle
      ? `<div style="margin-bottom:0.35rem;">
           <span style="display:inline-block; background:rgba(255,49,71,0.12); color:#FF3147; border:1px solid rgba(255,49,71,0.3); border-radius:4px; padding:0.15rem 0.5rem; font-size:0.7rem; font-weight:700;">
             🔗 İLİŞKİLİ GEÇMİŞ KARAR: ${f.relatedHistoryTitle}
           </span>
         </div>`
      : '';

    const reopenLabels = {
      auto_threshold: 'EBM %20+ artarsa veya dönüşüm %25+ düşerse tekrar uyar',
      cpa_above_target: 'Sadece EBM hedef sınırı aşarsa tekrar uyar',
      conv_drop_25: 'Sadece dönüşüm %25+ düşerse tekrar uyar',
      never_30d: '30 gün boyunca bu konuda uyarma'
    };

    const reasonHtml = (isHistoryView && (f.resolutionReason || f.resolutionNote))
      ? `<div style="margin-top:0.4rem; font-size:0.74rem; color:var(--text-primary); background:rgba(16,185,129,0.07); padding:0.32rem 0.55rem; border-radius:4px; border-left:3px solid var(--emerald);">
           <strong>${f.resolvedStatus === 'completed' ? '🛠️ Uygulanan İşlem:' : '📌 Yoksayma Sebebi:'}</strong> ${f.resolutionReason || 'Belirtilmedi'}
           ${f.resolutionNote ? `<div style="margin-top:0.15rem; color:var(--text-secondary);">💬 <em>"${f.resolutionNote}"</em></div>` : ''}
           ${f.resolvedStatus === 'dismissed' && f.reopenIf ? `<div style="margin-top:0.15rem; font-size:0.69rem; color:var(--text-muted);">🔔 Yeniden Uyarılma Kuralı: ${reopenLabels[f.reopenIf] || f.reopenIf}</div>` : ''}
         </div>`
      : '';

    const snapInfo = (isHistoryView && f.metricsSnapshot)
      ? `<div style="margin-top:0.35rem; font-size:0.72rem; color:var(--text-muted); background:rgba(255,255,255,0.03); padding:0.25rem 0.5rem; border-radius:4px; border:1px solid var(--border-subtle);">
           📸 <strong>Karar Anı Baz Metrik:</strong> Saf Lead EBM: ₺${f.metricsSnapshot.leadCpaTl ?? f.metricsSnapshot.currentCpaTl ?? '—'} · 5G Lead Dönüşüm: ${f.metricsSnapshot.leadConversions5d ?? f.metricsSnapshot.conversions5d ?? 0} · 5G Harcama: ₺${f.metricsSnapshot.spend5dTl ?? 0}
         </div>`
      : '';

    return `
      <article class="finding-row sev-${f.severity} ${isHistoryView ? 'is-resolved' : ''}">
        <div class="finding-meta-col">
          <span class="sev-badge ${f.severity}">${badgeLabels[f.severity] || 'BULGU'}</span>
          <span class="finding-acc-name" onclick="openAccountDetail('${f.accountId}')" title="Hesap detayını aç">${f.accountName}</span>
          <span class="finding-acc-sector">${f.accountSector}</span>
        </div>
        <div class="finding-body-col">
          <span class="finding-cat">${f.category}</span>
          ${relatedBadge}
          <h3 class="finding-title">${f.title}</h3>
          <p class="finding-detail">${f.detail}</p>
          ${reasonHtml}
          ${snapInfo}
        </div>
        <div class="finding-action-col">
          <div class="finding-top-bar">
            <span class="finding-timestamp" title="Öneri kartının oluşturulma tarihi ve saati">🕒 ${createdStr}</span>
            ${topBarRight}
          </div>
          <div>
            <span class="action-label">AKSİYON</span>
            <p class="action-text">${f.action}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderAccounts() {
  const grid = document.getElementById('accountsGrid');
  const all = state.db.accounts;

  const approvedCount = all.filter(a => a.approved).length;
  const pendingCount = all.length - approvedCount;
  const tabs = document.querySelectorAll('#accountFilters .tab-btn');
  if (tabs.length === 3) {
    tabs[0].textContent = `Tümü (${all.length})`;
    tabs[1].textContent = `Aktif (${approvedCount})`;
    tabs[2].textContent = `Pasif (${pendingCount})`;
  }

  let list = all;
  if (state.accountFilter === 'approved') list = all.filter(a => a.approved);
  if (state.accountFilter === 'pending') list = all.filter(a => !a.approved);

  grid.innerHTML = list.map(acc => {
    const hasMapConv = (acc.mapConversions5d || 0) > 0 && acc.leadCpaTl != null;
    const displayCpa = hasMapConv ? acc.leadCpaTl : acc.currentCpaTl;
    const targetTxt = acc.targetCpaTl != null ? `₺${acc.targetCpaTl}` : '—';
    const overCpa = acc.targetCpaTl != null && displayCpa > acc.targetCpaTl;
    const convTxt = hasMapConv
      ? `${acc.leadConversions5d} Lead <span style="font-size:0.68rem; color:var(--text-muted);">+${acc.mapConversions5d} Harita</span>`
      : `${acc.conversions5d}`;
    const cpaTitle = hasMapConv
      ? `Saf Lead EBM: ₺${acc.leadCpaTl} (Yol tarifi dahil karma EBM: ₺${acc.currentCpaTl})`
      : '';

    return `
      <div class="account-card ${acc.approved ? '' : 'unapproved'}">
        <div class="acc-card-clickable" onclick="openAccountDetail('${acc.id}')">
          <div class="acc-card-top">
            <div class="acc-header-row">
              <div>
                <span class="acc-cid">${acc.customerId} · ${acc.location}</span>
                <h3 class="acc-title">${acc.name}</h3>
                <span class="acc-kulvar">${acc.sector} · ${acc.primaryGoal}</span>
              </div>
              <span class="health-pill">Skor: ${acc.healthScore ?? '—'}</span>
            </div>
          </div>

          <div class="acc-metrics-grid">
            <div class="acc-metric">
              <span class="acc-metric-lbl">KAMPANYA</span>
              <span class="acc-metric-val">${acc.activeCampaigns} Aktif</span>
            </div>
            <div class="acc-metric" title="${cpaTitle}">
              <span class="acc-metric-lbl">${hasMapConv ? 'HEDEF / LEAD EBM' : 'HEDEF / EBM'}</span>
              <span class="acc-metric-val ${overCpa ? 'over-cpa' : ''}">${targetTxt} / ₺${displayCpa ?? '—'}</span>
            </div>
            <div class="acc-metric">
              <span class="acc-metric-lbl">5G HARCAMA</span>
              <span class="acc-metric-val">${formatTl(acc.spend5dTl)}</span>
            </div>
            <div class="acc-metric">
              <span class="acc-metric-lbl">5G DÖNÜŞÜM</span>
              <span class="acc-metric-val">${convTxt}</span>
            </div>
          </div>

          <div class="acc-rules-box">
            ${acc.customRules || 'Özel kural tanımlanmadı.'}
          </div>
        </div>

        <div class="acc-card-footer">
          <div class="approval-toggle" onclick="toggleApproval('${acc.id}', '${acc.name.replace(/'/g, "\\'")}', ${acc.approved})">
            <span class="toggle-dot ${acc.approved ? 'on' : ''}"></span>
            <span>${acc.approved ? 'TAKİP AKTİF' : 'PASİF'}</span>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-crimson btn-sm" onclick="openAccountDetail('${acc.id}')">Detay &amp; Metrikler</button>
            <button class="btn btn-outline btn-sm" onclick="openEditAccount('${acc.id}')">Düzenle</button>
            <button class="btn btn-outline btn-sm" onclick="ignoreAccount('${acc.id}', '${acc.name.replace(/'/g, "\\'")}')" title="Yoksayılanlara taşı">Yoksay</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Hesap Detay Modalı ve Tarih Aralığı Hesaplamaları
function getRangeMultipliers(rangeKey) {
  switch (rangeKey) {
    case 'today': return { days: 1, factor: 0.21, label: 'Bugün' };
    case '5d':    return { days: 5, factor: 1.0,  label: 'Son 5 Gün' };
    case '7d':    return { days: 7, factor: 1.38, label: 'Son 7 Gün' };
    case '14d':   return { days: 14, factor: 2.72, label: 'Son 14 Gün' };
    case '30d':   return { days: 30, factor: 5.85, label: 'Son 30 Gün' };
    default:      return { days: 5, factor: 1.0,  label: 'Son 5 Gün' };
  }
}

function openAccountDetail(id) {
  state.activeDetailAccountId = id;
  renderAccountDetailModal(id);
  document.getElementById('accountDetailModal').classList.remove('hidden');
}

function renderAccountDetailModal(id) {
  const acc = state.db.accounts.find(a => a.id === id);
  if (!acc) return;

  const { factor, label } = getRangeMultipliers(state.detailRange);

  document.getElementById('detCid').textContent = `MÜŞTERİ ID: ${acc.customerId} · ${acc.location}`;
  document.getElementById('detName').textContent = acc.name;
  document.getElementById('detSector').textContent = `${acc.sector} · Ana Hedef: ${acc.primaryGoal}`;

  const realRange = acc.ranges && acc.ranges[state.detailRange];
  const spend = realRange ? Math.round(realRange.spend) : Math.round(acc.spend5dTl * factor);
  const conversions = realRange ? Math.round(realRange.conversions * 10) / 10 : Math.round(acc.conversions5d * factor);
  const clicks = realRange ? realRange.clicks : Math.round((acc.clicks5d || 1) * factor);
  const impressions = realRange ? realRange.impressions : Math.round((acc.impressions5d || 1) * factor);
  const ctr = realRange ? Number(realRange.ctr || 0) : Number(acc.ctrPercent || 0);
  const cpa = conversions > 0 ? Math.round(spend / conversions) : 0;
  const avgCpc = clicks > 0 ? (spend / clicks).toFixed(1) : 0;
  const convRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : 0;
  const rawImpShare = (realRange && realRange.impShare != null) ? realRange.impShare : acc.impressionSharePercent;
  const rawLostBudget = (realRange && realRange.budgetLostShare != null) ? realRange.budgetLostShare : acc.budgetLostSharePercent;
  const rawLostRank = (realRange && realRange.rankLostShare != null) ? realRange.rankLostShare : acc.rankLostSharePercent;
  const impShare = rawImpShare === 10 ? '≤%10' : (rawImpShare != null ? `%${rawImpShare}` : '—');
  const lostBudgetShare = rawLostBudget === 90 ? '≥%90' : (rawLostBudget != null ? `%${rawLostBudget}` : '—');
  const lostRankShare = rawLostRank === 90 ? '≥%90' : (rawLostRank != null ? `%${rawLostRank}` : '—');
  const topImpPct = (realRange && realRange.topImpPct != null) ? realRange.topImpPct : (acc.topImpPercent ?? '—');
  const absTopImpPct = (realRange && realRange.absTopImpPct != null) ? realRange.absTopImpPct : (acc.absTopImpPercent ?? '—');
  const optScore = acc.optimizationScore != null ? `%${acc.optimizationScore}` : '—';

  const hasMapConv = state.detailRange === '5d' && (acc.mapConversions5d || 0) > 0 && acc.leadCpaTl != null;
  const primaryCpaToCompare = hasMapConv ? acc.leadCpaTl : cpa;
  const overCpa = acc.targetCpaTl != null && primaryCpaToCompare > acc.targetCpaTl;
  const cpaMainDisplay = hasMapConv ? `₺${acc.leadCpaTl} (Lead)` : `₺${cpa}`;
  const cpaSubDisplay = hasMapConv
    ? `Karma EBM: ₺${cpa} · Hedef: ₺${acc.targetCpaTl ?? '—'} · Opt: ${optScore}`
    : `Hedef: ₺${acc.targetCpaTl ?? '—'} · Opt. Puanı: ${optScore}`;
  const convSubDisplay = hasMapConv
    ? `${acc.leadConversions5d} Lead + ${acc.mapConversions5d} Yol Tarifi (TO: %${convRate})`
    : `Dönüşüm Oranı: %${convRate}`;

  const convBreakdownText = Array.isArray(acc.conversionActions) && acc.conversionActions.length > 0
    ? acc.conversionActions.map(ca => `${ca.action}: ${ca.count5d}${ca.countingType === 'MANY' ? ' (HER/MANY!)' : ''}`).join(' · ')
    : 'Canlı MCC Verisi';

  document.getElementById('detailMetricsGrid').innerHTML = `
    <div class="detail-metric-box">
      <span class="detail-metric-lbl">HARCAMA (${label.toUpperCase()})</span>
      <span class="detail-metric-val">${formatTl(spend)}</span>
      <span class="detail-metric-sub">30 Günlük: ${formatTl(acc.spend30dTl || acc.spend5dTl * 5.8)}</span>
    </div>
    <div class="detail-metric-box">
      <span class="detail-metric-lbl">DÖNÜŞÜM (${label.toUpperCase()})</span>
      <span class="detail-metric-val">${conversions}</span>
      <span class="detail-metric-sub">${convSubDisplay}</span>
    </div>
    <div class="detail-metric-box">
      <span class="detail-metric-lbl">GERÇEKLEŞEN EBM / HEDEF</span>
      <span class="detail-metric-val ${overCpa ? 'crimson-text' : ''}">${cpaMainDisplay}</span>
      <span class="detail-metric-sub">${cpaSubDisplay}</span>
    </div>
    <div class="detail-metric-box">
      <span class="detail-metric-lbl">TIKLAMA &amp; ORT. TBM (CPC)</span>
      <span class="detail-metric-val">${clicks.toLocaleString('tr-TR')}</span>
      <span class="detail-metric-sub">Ort. TBM: ₺${avgCpc}</span>
    </div>
    <div class="detail-metric-box">
      <span class="detail-metric-lbl">GÖSTERİM &amp; TO (CTR)</span>
      <span class="detail-metric-val">${impressions.toLocaleString('tr-TR')}</span>
      <span class="detail-metric-sub">TO: %${ctr.toFixed(2)} · Üst: %${topImpPct} (1.Sıra: %${absTopImpPct})</span>
    </div>
    <div class="detail-metric-box">
      <span class="detail-metric-lbl">GÖSTERİM PAYI &amp; KAYIPLAR</span>
      <span class="detail-metric-val">${impShare}</span>
      <span class="detail-metric-sub">Bütçe Kaybı: ${lostBudgetShare} · Sıralama Kaybı: ${lostRankShare}</span>
    </div>
    <div class="detail-metric-box" style="grid-column: span 2;">
      <span class="detail-metric-lbl">5 GÜNLÜK DÖNÜŞÜM İŞLEMİ KIRILIMI (GERÇEK HEDEF DAĞILIMI)</span>
      <span class="detail-metric-val" style="font-size:1.05rem;">${convBreakdownText}</span>
      <span class="detail-metric-sub">Aktif Kampanya: ${acc.activeCampaigns} (PMax &amp; Arama)</span>
    </div>
  `;

  // Gerçek Kampanya Kırılım Satırları (Son 5 Gün Gerçek + Oranlama + Kampanya Bazlı Dönüşüm Kırılımı)
  const realCampaigns = Array.isArray(acc.campaigns) && acc.campaigns.length > 0 ? acc.campaigns : [];
  const rowsHtml = realCampaigns.map(c => {
    const cSpend = Math.round((c.spend5d || 0) * factor);
    const cConv = Math.max(0, Math.round((c.conversions5d || 0) * factor * 10) / 10);
    const cClicks = Math.max(1, Math.round((c.clicks5d || 1) * factor));
    const cImp = Math.max(1, Math.round((c.impressions5d || 1) * factor));
    const cCtr = Number(c.ctr5d || ((cClicks / cImp) * 100)).toFixed(2);
    const cCpc = (cSpend / cClicks).toFixed(1);
    const cCpa = cConv > 0 ? Math.round(cSpend / cConv) : cSpend;
    const typeLabel = c.type === 'PERFORMANCE_MAX' ? 'PMax' : (c.type === 'SEARCH' ? 'Arama' : (c.type || 'Aktif'));
    const lostTxt = c.budgetLostShare != null ? ` · Bütçe Kaybı: ${c.budgetLostShare === 90 ? '≥%90' : '%' + c.budgetLostShare}` : '';
    const rankTxt = c.rankLostShare != null ? ` · Sıra Kaybı: ${c.rankLostShare === 90 ? '≥%90' : '%' + c.rankLostShare}` : '';
    const budgetTxt = c.dailyBudgetTl != null ? ` · Günlük Bütçe: ₺${c.dailyBudgetTl}` : '';
    const tcpaTxt = c.targetCpaTl != null ? ` · Hedef EBM: ₺${c.targetCpaTl}` : (c.targetRoas != null ? ` · Hedef ROAS: ${c.targetRoas}` : '');
    const geoTxt = c.positiveGeoTargetType === 'PRESENCE_OR_INTEREST' ? ` · ⚠️ Konum: İlgi Dahil` : (c.positiveGeoTargetType === 'PRESENCE' ? ` · Konum: Sadece Bulunanlar` : '');

    const reasonLabels = {
      BUDGET_CONSTRAINED: 'Bütçeyle Sınırlı',
      SEARCH_VOLUME_LIMITED: 'Arama Hacmiyle Sınırlı',
      BIDDING_STRATEGY_CONSTRAINED: 'Hedefle/Teklifle Sınırlı',
      BIDDING_STRATEGY_LEARNING: 'Öğreniyor',
      HAS_ASSET_GROUPS_LIMITED_BY_POLICY: 'Politika Kısıtlı (Öğe Grubu)',
      AD_GROUPS_PAUSED: 'Reklam Grupları Duraklatıldı'
    };
    const statusReasons = Array.isArray(c.primaryStatusReasons) && c.primaryStatusReasons.length > 0
      ? c.primaryStatusReasons.map(r => reasonLabels[r] || r).join(', ')
      : (c.primaryStatus === 'LEARNING' ? 'Öğreniyor' : (c.primaryStatus === 'ELIGIBLE' ? 'Uygun' : (c.primaryStatus || '')));
    const statusBadge = statusReasons
      ? `<span style="display:inline-block; margin-left:0.4rem; padding:0.08rem 0.4rem; border-radius:4px; font-size:0.66rem; background:${c.primaryStatus === 'ELIGIBLE' && (!c.primaryStatusReasons || c.primaryStatusReasons.length === 0) ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.16)'}; color:${c.primaryStatus === 'ELIGIBLE' && (!c.primaryStatusReasons || c.primaryStatusReasons.length === 0) ? 'var(--emerald)' : '#F59E0B'};">${statusReasons}</span>`
      : '';

    const locSum = c.locationSummary;
    const locSumHtml = locSum && ((locSum.locations && locSum.locations.length > 0) || locSum.proximityCount > 0)
      ? `<div style="font-size:0.69rem; color:var(--text-secondary); margin-top:2px;">📍 Konum: ${(locSum.locations || []).slice(0, 6).join(', ')}${(locSum.locations || []).length > 6 ? ' +' + (locSum.locations.length - 6) + ' ilçe' : ''}${locSum.proximityCount > 0 ? ` · ⭕ ${locSum.proximityCount} Çember (${(locSum.proximityRadii || []).slice(0, 3).join(', ')})` : ''}</div>`
      : '';

    const campConvTxt = Array.isArray(c.conversionBreakdown) && c.conversionBreakdown.length > 0
      ? `<div style="font-size:0.7rem; color:var(--emerald); margin-top:2px;">🎯 Üretilen Dönüşüm: ${c.conversionBreakdown.map(cb => `${cb.action} (${cb.count5d})`).join(', ')}</div>`
      : '';

    return `
      <tr>
        <td>
          <strong>${c.name}</strong>${statusBadge}
          <div style="font-size:0.72rem; color:var(--text-muted);">${typeLabel}${budgetTxt}${tcpaTxt}${lostTxt}${rankTxt}${geoTxt}</div>
          ${locSumHtml}
          ${campConvTxt}
        </td>
        <td><span style="color:var(--emerald); font-family:var(--font-mono); font-size:0.72rem;">${typeLabel.toUpperCase()}</span></td>
        <td>${formatTl(cSpend)}</td>
        <td>${cImp.toLocaleString('tr-TR')}</td>
        <td>${cClicks.toLocaleString('tr-TR')}</td>
        <td>%${cCtr}</td>
        <td>₺${cCpc}</td>
        <td>${cConv}</td>
        <td class="${cCpa > acc.targetCpaTl ? 'crimson-text' : ''}"><strong>₺${cCpa}</strong></td>
      </tr>
    `;
  });

  document.querySelector('#detailCampaignsTable tbody').innerHTML = rowsHtml.join('') || `<tr><td colspan="9">Aktif kampanya verisi yok.</td></tr>`;

  // Gerçek Arama Terimleri Tablosu
  const terms = Array.isArray(acc.topSearchTerms) ? acc.topSearchTerms : [];
  const termRows = terms.map(t => {
    const tCost = Number(t.costTl || 0);
    const tConv = Math.round(Number(t.conv || 0) * 10) / 10;
    const tCpa = tConv > 0 ? `₺${Math.round(tCost / tConv)}` : '0 Dönüşüm';
    return `
      <tr>
        <td><strong>${t.term}</strong></td>
        <td>${t.clicks}</td>
        <td>${formatTl(tCost)}</td>
        <td>${tConv}</td>
        <td class="${tConv === 0 ? 'crimson-text' : ''}"><strong>${tCpa}</strong></td>
      </tr>
    `;
  });
  const searchTermsBody = document.querySelector('#detailSearchTermsTable tbody');
  if (searchTermsBody) {
    searchTermsBody.innerHTML = termRows.join('') || `<tr><td colspan="5">Arama terimi verisi yok.</td></tr>`;
  }

  const sp = acc.strategyProfile;
  const strategyHtml = sp
    ? `<div style="margin-top:0.45rem; font-size:0.79rem; display:grid; grid-template-columns:1fr 1fr; gap:0.35rem 1rem; border-top:1px solid var(--border-hairline); padding-top:0.45rem;">
         ${sp.northStarConversion ? `<div><strong>🎯 Kuzey Yıldızı:</strong> ${sp.northStarConversion}</div>` : ''}
         ${sp.campaignRoles ? `<div><strong>🧭 Kampanya Rolleri:</strong> ${sp.campaignRoles}</div>` : ''}
         ${sp.visibilityVsVolume ? `<div><strong>⚡ Öncelik:</strong> ${sp.visibilityVsVolume}</div>` : ''}
         ${sp.redLines ? `<div><strong>🛑 Kırmızı Çizgiler:</strong> ${sp.redLines}</div>` : ''}
       </div>`
    : '';
  document.getElementById('detRulesBanner').innerHTML = `<strong>Hesap Anayasası &amp; Kurallar:</strong> ${acc.customRules || 'Özel kural girilmemiş.'}${strategyHtml}`;

  const badgeLabels = { critical: 'KRİTİK', warning: 'UYARI', suggestion: 'ÖNERİ' };
  const fList = acc.findings || [];
  document.getElementById('detailFindingsList').innerHTML = fList.map((f, idx) => {
    const createdStr = formatFindingDate(f.createdAt);
    const safeId = (f.id || '').replace(/'/g, "\\'");
    return `
      <article class="finding-row sev-${f.severity}" style="grid-template-columns: 140px 1fr 290px;">
        <div class="finding-meta-col">
          <span class="sev-badge ${f.severity}">${badgeLabels[f.severity] || 'BULGU'}</span>
          <span class="finding-acc-sector">${f.category}</span>
        </div>
        <div class="finding-body-col">
          <h3 class="finding-title" style="margin-top:0;">${f.title}</h3>
          <p class="finding-detail">${f.detail}</p>
        </div>
        <div class="finding-action-col">
          <div class="finding-top-bar">
            <span class="finding-timestamp">🕒 ${createdStr}</span>
            <div class="finding-quick-actions">
              <button class="finding-act-btn complete" onclick="markFindingStatus('${acc.id}', ${idx}, '${safeId}', 'completed')" title="Tamamlandı olarak işaretle">✓ Tamamlandı</button>
              <button class="finding-act-btn dismiss" onclick="markFindingStatus('${acc.id}', ${idx}, '${safeId}', 'dismissed')" title="Yoksay">✕ Yoksay</button>
            </div>
          </div>
          <div>
            <span class="action-label">AKSİYON</span>
            <p class="action-text">${f.action}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderArchive() {
  const list = document.getElementById('archiveList');
  const reports = state.db.reportsArchive || [];

  list.innerHTML = reports.map(rep => `
    <div class="archive-item">
      <div class="archive-date">
        <span>${rep.date}</span>
        <span>${rep.accountsAudited} HESAP</span>
      </div>
      <h4 class="archive-name">${rep.title}</h4>
      <p class="archive-summary">${rep.summary}</p>
      <div class="archive-actions">
        <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);">
          🔴 ${rep.criticalCount} · 🟡 ${rep.warningCount} · 🟢 ${rep.suggestionCount}
        </span>
        <button class="btn btn-crimson btn-sm" onclick="downloadReportPdf('${rep.id}')">
          PDF İndir
        </button>
      </div>
    </div>
  `).join('');
}

function renderIgnored() {
  const list = document.getElementById('ignoredList');
  const ignored = state.db.ignoredAccounts || [];
  if (ignored.length === 0) {
    list.innerHTML = `<div class="ignored-item">Yoksayılan hesap yok.</div>`;
    return;
  }
  list.innerHTML = ignored.map(item => `
    <div class="ignored-item">
      <strong>${item.name}</strong>
      <span>ID: ${item.customerId} — ${item.reason}</span>
    </div>
  `).join('');
}

// İkinci onay (Confirmation) ile Aktif/Pasif değiştirme
async function toggleApproval(id, name, currentlyApproved) {
  const actionText = currentlyApproved
    ? `"${name}" hesabını 5 günlük denetim takibinden çıkarıp PASİF yapmak istediğine emin misin?`
    : `"${name}" hesabını 5 günlük denetim takibine dahil edip AKTİF yapmak istiyor musun?`;

  if (!confirm(actionText)) return;

  if (isLocalhost()) {
    const res = await fetch('/api/accounts/toggle-approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.db) {
      state.db = data.db;
      populateFilterDropdowns();
      renderAll();
    }
    return;
  }

  const acc = state.db.accounts.find(a => a.id === id);
  if (!acc) return;
  acc.approved = !acc.approved;
  acc.status = acc.approved ? 'healthy' : 'pending';
  const ok = await saveDbToGitHub(state.db, `chore: toggle approval for ${acc.name}`);
  if (ok) {
    populateFilterDropdowns();
    renderAll();
  }
}

async function ignoreAccount(id, name) {
  if (!confirm(`"${name}" hesabını Yıldız Spot gibi yoksayılanlar listesine taşımak istiyor musun?`)) return;

  if (isLocalhost()) {
    const res = await fetch('/api/accounts/ignore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reason: 'Panel üzerinden takip dışı bırakıldı.' })
    });
    const data = await res.json();
    if (data.db) {
      state.db = data.db;
      populateFilterDropdowns();
      renderAll();
    }
    return;
  }

  const idx = state.db.accounts.findIndex(a => a.id === id);
  if (idx === -1) return;
  const removed = state.db.accounts.splice(idx, 1)[0];
  state.db.ignoredAccounts.push({
    customerId: removed.customerId,
    name: removed.name,
    reason: 'Panel üzerinden takip dışı bırakıldı.'
  });
  if (!state.db.settings.ignoredCustomerIds.includes(removed.customerId)) {
    state.db.settings.ignoredCustomerIds.push(removed.customerId);
  }
  const ok = await saveDbToGitHub(state.db, `chore: ignore account ${removed.name}`);
  if (ok) {
    populateFilterDropdowns();
    renderAll();
  }
}

function openEditAccount(id) {
  const modal = document.getElementById('accountModal');
  const acc = state.db.accounts.find(a => a.id === id);
  if (!acc) return;

  document.getElementById('accountModalTitle').textContent = `${acc.name} — Düzenle`;
  document.getElementById('accId').value = acc.id;
  document.getElementById('accName').value = acc.name;
  document.getElementById('accCustomerId').value = acc.customerId;
  document.getElementById('accSector').value = acc.sector;
  document.getElementById('accLocation').value = acc.location;
  document.getElementById('accGoal').value = acc.primaryGoal;
  document.getElementById('accCampaigns').value = acc.activeCampaigns;
  document.getElementById('accTargetCpa').value = acc.targetCpaTl;
  document.getElementById('accCurrentCpa').value = acc.currentCpaTl;
  document.getElementById('accRules').value = acc.customRules;

  modal.classList.remove('hidden');
}

function downloadReportPdf(reportId) {
  const rep = state.db.reportsArchive.find(r => r.id === reportId) || state.db.reportsArchive[0];
  const approved = state.db.accounts.filter(a => a.approved);
  const printBox = document.getElementById('printableReportContainer');

  const sevMeta = {
    critical: {
      label: 'KRİTİK MÜDAHALE',
      border: '#E11D48',
      badgeBg: '#FFE4E6',
      badgeText: '#BE123C',
      badgeBorder: '#FDA4AF',
      cardBg: '#FFFBFB',
      actionBg: '#FFF1F2'
    },
    warning: {
      label: 'UYARI',
      border: '#D97706',
      badgeBg: '#FEF3C7',
      badgeText: '#B45309',
      badgeBorder: '#FCD34D',
      cardBg: '#FFFFFF',
      actionBg: '#FFFBEB'
    },
    suggestion: {
      label: 'BÜYÜME ÖNERİSİ',
      border: '#059669',
      badgeBg: '#D1FAE5',
      badgeText: '#047857',
      badgeBorder: '#6EE7B7',
      cardBg: '#FFFFFF',
      actionBg: '#ECFDF5'
    }
  };

  const findingsHtml = approved.map((acc, accIdx) => {
    const numStr = String(accIdx + 1).padStart(2, '0');
    const effCpa = acc.leadCpaTl != null ? acc.leadCpaTl : acc.currentCpaTl;
    const isOverCpa = acc.targetCpaTl != null && effCpa != null && effCpa > acc.targetCpaTl;
    const cpaColor = isOverCpa ? '#BE123C' : '#047857';
    const cpaBg = isOverCpa ? '#FFE4E6' : '#D1FAE5';

    const items = (acc.findings || []).map(f => {
      const m = sevMeta[f.severity] || sevMeta.warning;
      const historyBadge = f.relatedHistoryTitle
        ? `<span style="display:inline-block; background:#E2E8F0; color:#1E293B; font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:600; padding:2px 7px; border-radius:4px; margin-left:6px;">GEÇMİŞ KARAR: ${f.relatedHistoryTitle}</span>`
        : '';

      return `
        <div class="rep-finding-card" style="background:${m.cardBg}; border:1px solid #CBD5E1; border-left:4px solid ${m.border}; border-radius:6px; padding:11px 14px; margin-bottom:10px;">
          <div style="display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
            <span style="display:inline-block; background:${m.badgeBg}; color:${m.badgeText}; border:1px solid ${m.badgeBorder}; font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:700; letter-spacing:0.05em; padding:2px 8px; border-radius:4px;">
              ${m.label}
            </span>
            <span style="display:inline-block; background:#F1F5F9; color:#334155; border:1px solid #CBD5E1; font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; padding:2px 8px; border-radius:4px;">
              ${f.category || 'GENEL DENETİM'}
            </span>
            ${historyBadge}
          </div>
          <div style="font-family:'Newsreader',Georgia,serif; font-size:15px; font-weight:600; color:#0F172A; line-height:1.3; margin-bottom:5px;">
            ${f.title}
          </div>
          <div style="font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#334155; line-height:1.55; margin-bottom:8px;">
            ${f.detail}
          </div>
          <div style="background:${m.actionBg}; border:1px solid #E2E8F0; border-left:3px solid ${m.border}; border-radius:4px; padding:7px 10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; color:#0F172A; line-height:1.45;">
            <strong style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.05em; color:${m.badgeText}; text-transform:uppercase; margin-right:6px;">AKSİYON PLANI &rarr;</strong>
            ${f.action}
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="rep-account-block" style="margin-bottom:24px;">
        <div class="rep-account-header" style="background:#1D232C; color:#F8FAFC; border-top:3px solid #FF3147; border-radius:6px; padding:12px 16px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="flex:1; min-width:240px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span style="background:#FF3147; color:#FFFFFF; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:700; padding:2px 6px; border-radius:3px;">#${numStr}</span>
              <span style="font-family:'Newsreader',Georgia,serif; font-size:18px; font-weight:600; color:#FFFFFF;">${acc.name}</span>
              <span style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:#94A3B8;">(${acc.customerId})</span>
            </div>
            <div style="font-family:'Plus Jakarta Sans',sans-serif; font-size:11.5px; color:#CBD5E1; margin-top:3px;">
              ${acc.sector}
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <div style="background:#262E3A; border:1px solid rgba(255,255,255,0.12); padding:5px 10px; border-radius:4px; text-align:right;">
              <div style="font-family:'IBM Plex Mono',monospace; font-size:9px; color:#94A3B8; text-transform:uppercase;">5G HARCAMA</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size:12.5px; font-weight:600; color:#FFFFFF;">${formatTl(acc.spend5dTl)}</div>
            </div>
            <div style="background:#262E3A; border:1px solid rgba(255,255,255,0.12); padding:5px 10px; border-radius:4px; text-align:right;">
              <div style="font-family:'IBM Plex Mono',monospace; font-size:9px; color:#94A3B8; text-transform:uppercase;">5G DÖNÜŞÜM</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size:12.5px; font-weight:600; color:#FFFFFF;">${acc.conversions5d}</div>
            </div>
            <div style="background:#262E3A; border:1px solid rgba(255,255,255,0.12); padding:5px 10px; border-radius:4px; text-align:right;">
              <div style="font-family:'IBM Plex Mono',monospace; font-size:9px; color:#94A3B8; text-transform:uppercase;">HEDEF EBM</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size:12.5px; font-weight:600; color:#FFFFFF;">₺${acc.targetCpaTl ?? '—'}</div>
            </div>
            <div style="background:${cpaBg}; border:1px solid ${cpaColor}; padding:5px 10px; border-radius:4px; text-align:right;">
              <div style="font-family:'IBM Plex Mono',monospace; font-size:9px; color:${cpaColor}; font-weight:700; text-transform:uppercase;">MEVCUT EBM</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size:12.5px; font-weight:700; color:${cpaColor};">₺${effCpa ?? '—'}</div>
            </div>
          </div>
        </div>
        <div>${items}</div>
      </section>
    `;
  }).join('');

  printBox.innerHTML = `
    <div style="background:#1D232C; color:#FFFFFF; padding:18px 22px; border-bottom:4px solid #FF3147; border-radius:6px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.14em; color:#FF3147; font-weight:700; text-transform:uppercase; margin-bottom:4px;">
          BUSINED’S — OTONOM GOOGLE ADS DENETİM RAPORU
        </div>
        <h1 style="font-family:'Instrument Serif',Georgia,serif; font-size:30px; font-weight:400; margin:0; color:#F3EFEA; line-height:1.1;">
          ${rep.title}
        </h1>
      </div>
      <div style="text-align:right; font-family:'IBM Plex Mono',monospace; font-size:11px; color:#CBD5E1;">
        <div>DÖNEM: <strong style="color:#FFFFFF;">${rep.period}</strong></div>
        <div style="margin-top:2px;">İNCELENEN: <strong style="color:#FFFFFF;">${rep.accountsAudited} ONAYLI HESAP</strong></div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:14px;">
      <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-top:3px solid #1D232C; border-radius:6px; padding:10px 12px;">
        <div style="font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:#475569; text-transform:uppercase;">TOPLAM 5G HARCAMA</div>
        <div style="font-family:'Newsreader',Georgia,serif; font-size:20px; font-weight:600; color:#0F172A; margin-top:2px;">${formatTl(rep.totalSpendTl)}</div>
      </div>
      <div style="background:#FFF1F2; border:1px solid #FECDD3; border-top:3px solid #E11D48; border-radius:6px; padding:10px 12px;">
        <div style="font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:#BE123C; font-weight:600; text-transform:uppercase;">KRİTİK MÜDAHALE</div>
        <div style="font-family:'Newsreader',Georgia,serif; font-size:20px; font-weight:700; color:#BE123C; margin-top:2px;">${rep.criticalCount} Bulgu</div>
      </div>
      <div style="background:#FFFBEB; border:1px solid #FDE68A; border-top:3px solid #D97706; border-radius:6px; padding:10px 12px;">
        <div style="font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:#B45309; font-weight:600; text-transform:uppercase;">PERFORMANS UYARISI</div>
        <div style="font-family:'Newsreader',Georgia,serif; font-size:20px; font-weight:700; color:#B45309; margin-top:2px;">${rep.warningCount} Bulgu</div>
      </div>
      <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-top:3px solid #059669; border-radius:6px; padding:10px 12px;">
        <div style="font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:#047857; font-weight:600; text-transform:uppercase;">BÜYÜME ÖNERİSİ</div>
        <div style="font-family:'Newsreader',Georgia,serif; font-size:20px; font-weight:700; color:#047857; margin-top:2px;">${rep.suggestionCount} Öneri</div>
      </div>
    </div>

    <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-left:4px solid #1D232C; border-radius:6px; padding:10px 14px; margin-bottom:20px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#1E293B; line-height:1.5;">
      <strong style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; text-transform:uppercase; letter-spacing:0.04em; color:#0F172A;">YÖNETİCİ ÖZETİ:</strong> ${rep.summary}
    </div>

    ${findingsHtml}
  `;

  window.print();
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Bölüm 1 Filtreleri
  document.getElementById('findingFilters').addEventListener('click', e => {
    if (!e.target.classList.contains('tab-btn')) return;
    document.querySelectorAll('#findingFilters .tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.findingFilter = e.target.dataset.filter;
    renderFindings();
  });

  document.getElementById('filterAccountSelect').addEventListener('change', e => {
    state.findingAccountFilter = e.target.value;
    renderFindings();
  });

  document.getElementById('filterCategorySelect').addEventListener('change', e => {
    state.findingCategoryFilter = e.target.value;
    renderFindings();
  });

  const timeSelectEl = document.getElementById('filterTimeSelect');
  if (timeSelectEl) {
    timeSelectEl.addEventListener('change', e => {
      state.findingTimeFilter = e.target.value;
      renderFindings();
    });
  }

  // Bölüm 2 Filtreleri
  document.getElementById('accountFilters').addEventListener('click', e => {
    if (!e.target.classList.contains('tab-btn')) return;
    document.querySelectorAll('#accountFilters .tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.accountFilter = e.target.dataset.accFilter;
    renderAccounts();
  });

  // Hesap Detay Modalı Olayları
  document.getElementById('closeDetailModal').addEventListener('click', () => {
    state.activeDetailAccountId = null;
    document.getElementById('accountDetailModal').classList.add('hidden');
  });

  document.getElementById('detailRangeTabs').addEventListener('click', e => {
    if (!e.target.classList.contains('tab-btn')) return;
    document.querySelectorAll('#detailRangeTabs .tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.detailRange = e.target.dataset.range;
    if (state.activeDetailAccountId) {
      renderAccountDetailModal(state.activeDetailAccountId);
    }
  });

  document.getElementById('btnEditFromDetail').addEventListener('click', () => {
    const id = state.activeDetailAccountId;
    document.getElementById('accountDetailModal').classList.add('hidden');
    if (id) openEditAccount(id);
  });

  // Claude İle Hızlı Ekle Modalı
  document.getElementById('btnOpenClaudeImport').addEventListener('click', () => {
    document.getElementById('claudePromptText').value = CLAUDE_PROMPT_TEMPLATE;
    document.getElementById('claudeModal').classList.remove('hidden');
  });

  document.getElementById('closeClaudeModal').addEventListener('click', () => {
    document.getElementById('claudeModal').classList.add('hidden');
  });

  document.getElementById('btnCopyClaudePrompt').addEventListener('click', () => {
    const txt = document.getElementById('claudePromptText');
    txt.select();
    navigator.clipboard.writeText(txt.value);
    const btn = document.getElementById('btnCopyClaudePrompt');
    btn.textContent = 'Kopyalandı!';
    setTimeout(() => { btn.textContent = 'Promptu Kopyala'; }, 2000);
  });

  document.getElementById('btnImportClaudeJson').addEventListener('click', async () => {
    const raw = document.getElementById('claudeJsonInput').value.trim();
    if (!raw) return alert('Lütfen Claude tarafından üretilen JSON çıktısını yapıştırın.');
    try {
      const parsed = JSON.parse(raw);
      if (isLocalhost()) {
        const res = await fetch('/api/accounts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
        const data = await res.json();
        if (data.db) {
          state.db = data.db;
          populateFilterDropdowns();
          renderAll();
          document.getElementById('claudeJsonInput').value = '';
          document.getElementById('claudeModal').classList.add('hidden');
        }
        return;
      }
      const normCid = (c) => String(c || '').replace(/[^0-9]/g, '');
      const parsedCid = normCid(parsed.customerId);
      const existingIdx = state.db.accounts.findIndex(a =>
        (parsed.id && a.id === parsed.id) ||
        (parsedCid && normCid(a.customerId) === parsedCid) ||
        (parsed.name && a.name.toLowerCase().trim() === String(parsed.name).toLowerCase().trim())
      );

      const nowIso = new Date().toISOString();
      if (existingIdx !== -1) {
        const existing = state.db.accounts[existingIdx];
        const updatedFindings = Array.isArray(parsed.findings) && parsed.findings.length > 0
          ? parsed.findings.map((f, i) => ({
              id: f.id || `f-${existing.id}-${Date.now()}-${i}`,
              createdAt: f.createdAt || nowIso,
              status: f.status || 'active',
              ...f
            }))
          : existing.findings;

        state.db.accounts[existingIdx] = {
          ...existing,
          name: parsed.name || existing.name,
          customerId: parsed.customerId || existing.customerId,
          sector: parsed.sector || existing.sector,
          location: parsed.location || existing.location,
          primaryGoal: parsed.primaryGoal || existing.primaryGoal,
          activeCampaigns: parsed.activeCampaigns != null ? Number(parsed.activeCampaigns) : existing.activeCampaigns,
          targetCpaTl: parsed.targetCpaTl != null ? Number(parsed.targetCpaTl) : existing.targetCpaTl,
          currentCpaTl: parsed.currentCpaTl != null ? Number(parsed.currentCpaTl) : existing.currentCpaTl,
          customRules: parsed.customRules !== undefined ? parsed.customRules : existing.customRules,
          strategyProfile: parsed.strategyProfile !== undefined ? parsed.strategyProfile : existing.strategyProfile,
          findings: updatedFindings
        };
      } else {
        const newId = 'acc-' + Date.now();
        const newAcc = {
          id: newId,
          approved: true,
          status: 'healthy',
          healthScore: 88,
          ...parsed,
          findings: Array.isArray(parsed.findings)
            ? parsed.findings.map((f, i) => ({
                id: f.id || `f-${newId}-${Date.now()}-${i}`,
                createdAt: f.createdAt || nowIso,
                status: 'active',
                ...f
              }))
            : []
        };
        state.db.accounts.unshift(newAcc);
      }

      const ok = await saveDbToGitHub(state.db, `feat: upsert account strategy ${parsed.name || parsed.customerId}`);
      if (ok) {
        populateFilterDropdowns();
        renderAll();
        document.getElementById('claudeJsonInput').value = '';
        document.getElementById('claudeModal').classList.add('hidden');
      }
    } catch (err) {
      alert('JSON formatı okunamadı. Lütfen sadece { ... } bloğunu yapıştırdığından emin ol.');
    }
  });

  // Hesap Ekle / Düzenle
  document.getElementById('btnNewAccount').addEventListener('click', () => {
    document.getElementById('accountForm').reset();
    document.getElementById('accId').value = '';
    document.getElementById('accountModalTitle').textContent = 'Yeni Hesap Ekle';
    document.getElementById('accountModal').classList.remove('hidden');
  });

  document.getElementById('closeAccountModal').addEventListener('click', () => {
    document.getElementById('accountModal').classList.add('hidden');
  });
  document.getElementById('btnCancelAccount').addEventListener('click', () => {
    document.getElementById('accountModal').classList.add('hidden');
  });

  document.getElementById('accountForm').addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      id: document.getElementById('accId').value || undefined,
      name: document.getElementById('accName').value,
      customerId: document.getElementById('accCustomerId').value,
      sector: document.getElementById('accSector').value,
      location: document.getElementById('accLocation').value,
      primaryGoal: document.getElementById('accGoal').value,
      activeCampaigns: Number(document.getElementById('accCampaigns').value),
      targetCpaTl: Number(document.getElementById('accTargetCpa').value),
      currentCpaTl: Number(document.getElementById('accCurrentCpa').value || 200),
      customRules: document.getElementById('accRules').value
    };

    if (isLocalhost()) {
      const res = await fetch('/api/accounts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.db) {
        state.db = data.db;
        populateFilterDropdowns();
        renderAll();
        document.getElementById('accountModal').classList.add('hidden');
      }
      return;
    }

    if (payload.id) {
      const idx = state.db.accounts.findIndex(a => a.id === payload.id);
      if (idx !== -1) state.db.accounts[idx] = { ...state.db.accounts[idx], ...payload };
    } else {
      state.db.accounts.unshift({
        ...payload,
        id: 'acc-' + Date.now(),
        approved: true,
        spend5dTl: 0,
        conversions5d: 0,
        ctrPercent: 5,
        impressionSharePercent: 60,
        status: 'healthy',
        healthScore: 88,
        findings: []
      });
    }
    const ok = await saveDbToGitHub(state.db, `chore: save account ${payload.name}`);
    if (ok) {
      populateFilterDropdowns();
      renderAll();
      document.getElementById('accountModal').classList.add('hidden');
    }
  });

  // Ayarlar
  document.getElementById('btnOpenSettings').addEventListener('click', async () => {
    const { settings } = state.db;
    document.getElementById('setAiModel').value = settings.aiModel || 'gemini-3-flash-preview';
    document.getElementById('setEmail').value = settings.emailRecipient || '';
    document.getElementById('setIgnoredIds').value = (settings.ignoredCustomerIds || []).join(', ');
    const ghInput = document.getElementById('setGithubToken');
    if (ghInput) ghInput.value = getStoredToken();
    const previewEl = document.getElementById('mccScriptPreview');
    previewEl.textContent = 'Güncel v3.3 MCC Script yükleniyor...';
    document.getElementById('settingsModal').classList.remove('hidden');

    try {
      if (isLocalhost()) {
        const res = await fetch('/api/mcc-script');
        const data = await res.json();
        if (data.code) previewEl.textContent = data.code;
      } else {
        const token = getStoredToken();
        if (token) {
          const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/scripts/google-ads-mcc-script.js?ref=main&t=${Date.now()}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.raw+json' }
          });
          if (res.ok) previewEl.textContent = await res.text();
        }
      }
    } catch (e) {
      previewEl.textContent = MCC_SCRIPT_SNIPPET;
    }
  });

  document.getElementById('closeSettingsModal').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('hidden');
  });

  // Tamamlandı / Yoksay Sebep & Aksiyon Hafızası Modalı
  const closeResModal = () => {
    document.getElementById('findingResolutionModal')?.classList.add('hidden');
    pendingResolutionContext = null;
  };
  document.getElementById('closeResolutionModal')?.addEventListener('click', closeResModal);
  document.getElementById('btnCancelResolution')?.addEventListener('click', closeResModal);

  document.getElementById('findingResolutionForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!pendingResolutionContext) return;
    const selectedRadio = document.querySelector('input[name="resolutionReasonRadio"]:checked');
    const resolutionReason = selectedRadio ? selectedRadio.value : '';
    const resolutionNote = (document.getElementById('resolutionNoteInput')?.value || '').trim();
    const reopenIf = pendingResolutionContext.newStatus === 'dismissed'
      ? (document.getElementById('resolutionReopenSelect')?.value || 'auto_threshold')
      : null;

    const ctx = { ...pendingResolutionContext };
    closeResModal();
    await markFindingStatus(ctx.accountId, ctx.findingIndex, ctx.findingId, ctx.newStatus, {
      resolutionReason,
      resolutionNote,
      reopenIf
    });
  });

  document.getElementById('settingsForm').addEventListener('submit', async e => {
    e.preventDefault();
    const ghInput = document.getElementById('setGithubToken');
    if (ghInput && ghInput.value.trim()) {
      localStorage.setItem('busineds_gh_token', ghInput.value.trim());
    }
    const ignoredCustomerIds = document.getElementById('setIgnoredIds').value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const payload = {
      aiModel: document.getElementById('setAiModel').value,
      emailRecipient: document.getElementById('setEmail').value,
      ignoredCustomerIds
    };

    if (isLocalhost()) {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.db) {
        state.db = data.db;
        renderAll();
        document.getElementById('settingsModal').classList.add('hidden');
      }
      return;
    }

    state.db.settings = { ...state.db.settings, ...payload };
    const ok = await saveDbToGitHub(state.db, 'chore: update settings via web panel');
    if (ok) {
      renderAll();
      document.getElementById('settingsModal').classList.add('hidden');
    }
  });

  document.getElementById('btnRunAudit').addEventListener('click', async () => {
    const btn = document.getElementById('btnRunAudit');
    const orig = btn.textContent;
    btn.textContent = 'DENETLENİYOR...';
    btn.disabled = true;
    try {
      if (isLocalhost()) {
        const res = await fetch('/api/audit/run', { method: 'POST' });
        const data = await res.json();
        if (data.db) {
          state.db = data.db;
          populateFilterDropdowns();
          renderAll();
        }
        return;
      }

      const token = getStoredToken();
      if (!token) {
        alert('Bulut denetimini tetiklemek için "Ayarlar & Script" menüsünden GitHub Token bilginizi girin.');
        return;
      }
      const dispRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_type: 'cronjob_audit', client_payload: { force_full: 'true' } })
      });
      if (dispRes.ok) {
        alert('Bulut denetimi başlatıldı! Yaklaşık 45 saniye içinde yeni rapor verileri otomatik yüklenecek.');
        setTimeout(() => loadData(), 45000);
      }
    } finally {
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
});
