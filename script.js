// 1. Fast preloader: default Telugu page loads quickly
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            
            setTimeout(() => {
                if (preloader) {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => { preloader.style.display = 'none'; }, 450);
                }
                triggerPostLoadAnimations();
            }, 1000); 
        });

        // 2. లోడింగ్ ముగిశాక వచ్చే సరికొత్త వరుస యానిమేషన్ల ఫంక్షన్
        function triggerPostLoadAnimations() {
            const header = document.getElementById('mainHeader');
            header.classList.add('show-after-load');

            const elements = document.querySelectorAll('.reveal-after-load');
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('active');
                    
                    if(element.classList.contains('bottom-quote-container')) {
                        startTypewriterAnimation();
                    }
                }, (index + 1) * 400);
            });
        }

        // 3. బాటమ్ కొటేషన్ కోసం టైప్‌రైటర్ ఫంక్షన్
        function startTypewriterAnimation() {
            const quoteText = "అన్నం పెట్టే రైతుకు అండగా నిలబడడం ప్రతి ఒక్కరి కనీస బాధ్యత.";
            const textElement = document.getElementById("typewriterText");
            let index = 0;

            function typeCharacter() {
                if (index < quoteText.length) {
                    textElement.innerHTML += quoteText.charAt(index);
                    index++;
                    setTimeout(typeCharacter, 100); 
                }
            }
            typeCharacter();
        }

        // 4. లోగో లైట్‌బాక్స్ మోడల్ కంట్రోల్స్
        const triggerLogo = document.getElementById('triggerLogo');
        const logoLightbox = document.getElementById('logoLightbox');
        const closeLightbox = document.getElementById('closeLightbox');

        triggerLogo.addEventListener('click', () => {
            logoLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeLightbox.addEventListener('click', () => {
            logoLightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        logoLightbox.addEventListener('click', (e) => {
            if (e.target === logoLightbox) {
                logoLightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // 5. ఇంటరాక్టివ్ కాంటాక్ట్ ఫారమ్ లాజిక్
        const menuContactBtn = document.getElementById('menuContactBtn');
        const interactiveContactCard = document.getElementById('interactiveContactCard');
        const closeFormBtn = document.getElementById('closeFormBtn');
        const contactForm = document.getElementById('grmbContactForm');

        menuContactBtn.addEventListener('click', () => {
            interactiveContactCard.classList.add('show-now');
            setTimeout(() => {
                interactiveContactCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        });

        closeFormBtn.addEventListener('click', () => {
            interactiveContactCard.classList.remove('show-now');
            contactForm.reset();
        });

        // ===================================================
        // 7. కొత్త రైతు ఫీచర్ల డెమో ఇంటరాక్షన్స్
        // ===================================================
        function showBox(id, html) {
            const box = document.getElementById(id);
            box.innerHTML = html;
            box.style.display = 'block';
        }

        const weatherCodeInfo = {
            0: ['☀️', 'నిర్మలమైన ఆకాశం'], 1: ['🌤️', 'కొంచెం మేఘాలు'], 2: ['⛅', 'మధ్యస్థ మేఘాలు'], 3: ['☁️', 'మబ్బుగా ఉంది'],
            45: ['🌫️', 'పొగమంచు'], 48: ['🌫️', 'మంచు పొర'], 51: ['🌦️', 'తేలికపాటి చినుకులు'], 53: ['🌦️', 'చినుకులు'], 55: ['🌧️', 'ఎక్కువ చినుకులు'],
            61: ['🌧️', 'తేలికపాటి వర్షం'], 63: ['🌧️', 'వర్షం'], 65: ['⛈️', 'భారీ వర్షం'], 71: ['🌨️', 'తేలికపాటి మంచు'], 73: ['🌨️', 'మంచు'], 75: ['❄️', 'భారీ మంచు'],
            80: ['🌦️', 'తేలికపాటి జల్లులు'], 81: ['🌧️', 'జల్లులు'], 82: ['⛈️', 'భారీ జల్లులు'], 95: ['⛈️', 'ఉరుములతో వర్షం'], 96: ['⛈️', 'ఉరుములు/వడగళ్ళు'], 99: ['⛈️', 'తీవ్ర ఉరుములు/వడగళ్ళు']
        };

        function weatherInfo(code) {
            return weatherCodeInfo[code] || ['🌡️', 'వాతావరణ సమాచారం'];
        }

        function setWeatherLoading(text) {
            showBox('weatherOutput', `⏳ ${text}<br><small>Live weather data తెస్తున్నాం...</small>`);
        }

        async function getLiveWeather() {
            const place = document.getElementById('weatherVillage').value.trim();
            if (!place) {
                showBox('weatherOutput', 'దయచేసి గ్రామం/సిటీ పేరు ఎంటర్ చేయండి. ఉదా: Madanapalle, Andhra Pradesh');
                return;
            }

            try {
                setWeatherLoading('మీ location వెతుకుతున్నాం');
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
                const geoRes = await fetch(geoUrl);
                if (!geoRes.ok) throw new Error('Location search failed');
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    showBox('weatherOutput', 'ఈ ప్రదేశం దొరకలేదు. దయచేసి గ్రామం + జిల్లా/రాష్ట్రం తో మళ్లీ ప్రయత్నించండి.');
                    return;
                }

                const loc = geoData.results[0];
                await fetchAndRenderWeather(loc.latitude, loc.longitude, `${loc.name}${loc.admin1 ? ', ' + loc.admin1 : ''}${loc.country ? ', ' + loc.country : ''}`, loc.timezone || 'auto');
            } catch (error) {
                showBox('weatherOutput', 'క్షమించండి, weather data తెచ్చే సమయంలో సమస్య వచ్చింది. Internet/API connection చెక్ చేయండి.');
            }
        }

        function getWeatherByMyLocation() {
            if (!navigator.geolocation) {
                showBox('weatherOutput', 'మీ browser location support చేయడం లేదు. గ్రామం/సిటీ పేరు టైప్ చేసి ప్రయత్నించండి.');
                return;
            }
            setWeatherLoading('మీ live location తీసుకుంటున్నాం');
            navigator.geolocation.getCurrentPosition(
                position => {
                    fetchAndRenderWeather(position.coords.latitude, position.coords.longitude, 'మీ ప్రస్తుత Location', 'auto');
                },
                () => {
                    showBox('weatherOutput', 'Location permission ఇవ్వలేదు లేదా location దొరకలేదు. గ్రామం/సిటీ పేరు ఎంటర్ చేసి ప్రయత్నించండి.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
        }

        async function fetchAndRenderWeather(lat, lon, placeName, timezone) {
            setWeatherLoading('వాతావరణ వివరాలు తెస్తున్నాం');
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&timezone=${encodeURIComponent(timezone)}&forecast_days=5`;
            const res = await fetch(weatherUrl);
            if (!res.ok) throw new Error('Weather fetch failed');
            const data = await res.json();
            renderLiveWeather(data, placeName);
        }

        function renderLiveWeather(data, placeName) {
            const c = data.current;
            const d = data.daily;
            const [icon, desc] = weatherInfo(c.weather_code);
            const daysHtml = d.time.map((date, i) => {
                const [dayIcon] = weatherInfo(d.weather_code[i]);
                const niceDate = new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                return `<div class="weather-day-card" style="animation-delay:${i * 0.08}s">
                    <div class="weather-day-date">${niceDate}</div>
                    <div class="weather-day-icon">${dayIcon}</div>
                    <div class="weather-day-temp">${Math.round(d.temperature_2m_min[i])}° / ${Math.round(d.temperature_2m_max[i])}°</div>
                    <small>Rain ${d.precipitation_probability_max[i] ?? 0}%</small>
                </div>`;
            }).join('');

            showBox('weatherOutput', `<div class="weather-main-live">
                <div class="weather-top-line">
                    <div class="weather-place">📍 ${placeName}</div>
                    <div class="weather-temp">${icon} ${Math.round(c.temperature_2m)}°C</div>
                    <div class="weather-desc">${desc} • Feels like ${Math.round(c.apparent_temperature)}°C</div>
                </div>
                <div class="weather-stats-grid">
                    <div class="weather-stat-box"><span class="weather-stat-label">వర్షం ఇప్పుడే</span><span class="weather-stat-value">${c.precipitation} mm</span></div>
                    <div class="weather-stat-box"><span class="weather-stat-label">Humidity</span><span class="weather-stat-value">${c.relative_humidity_2m}%</span></div>
                    <div class="weather-stat-box"><span class="weather-stat-label">గాలి వేగం</span><span class="weather-stat-value">${c.wind_speed_10m} km/h</span></div>
                    <div class="weather-stat-box"><span class="weather-stat-label">గాలి దిశ</span><span class="weather-stat-value">${c.wind_direction_10m}°</span></div>
                </div>
                <b>తర్వాతి 5 రోజుల వాతావరణం</b>
                <div class="weather-days">${daysHtml}</div>
                <div class="weather-note">ఈ data Open-Meteo live forecast API నుండి వస్తుంది. Forecast 100% guarantee కాదు; వ్యవసాయ నిర్ణయాలకు స్థానిక వ్యవసాయ అధికారి/వాతావరణ శాఖ హెచ్చరికలు కూడా చూడండి.</div>
            </div>`);
        }

        function normalizeMandiRecord(record) {
            const g = key => record[key] ?? record[key?.toLowerCase?.()] ?? '';
            return {
                state: g('state'), district: g('district'), market: g('market'), commodity: g('commodity'), variety: g('variety'),
                min_price: g('min_price'), max_price: g('max_price'), modal_price: g('modal_price'),
                arrival_date: g('arrival_date') || g('price_date') || g('date')
            };
        }

        async function getLiveMandiPrices() {
            const state = document.getElementById('marketState').value.trim();
            const district = document.getElementById('marketDistrict').value.trim();
            const market = document.getElementById('marketName').value.trim();
            const commodity = document.getElementById('marketCommodity').value.trim();
            showBox('marketOutput', '⏳ Official AGMARKNET/Data.gov.in నుండి live mandi prices తెస్తున్నాం...');
            const base = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
            const params = new URLSearchParams({'api-key':'579b464db66ec23bdd000001a7c9390174b44c2b647ebdc08', format:'json', limit:'25'});
            if (state) params.append('filters[state]', state);
            if (commodity) params.append('filters[commodity]', commodity);
            if (district) params.append('filters[district]', district);
            if (market) params.append('filters[market]', market);
            try {
                const response = await fetch(base + '?' + params.toString(), { cache: 'no-store' });
                if (!response.ok) throw new Error('Data.gov.in API response failed');
                const data = await response.json();
                const records = (data.records || []).map(normalizeMandiRecord).filter(r => r.commodity || r.market);
                if (!records.length) {
                    showBox('marketOutput', `<b>ఈ filter కి live record దొరకలేదు.</b><br>
                        <div class="market-status-line">District/Market ఖాళీగా వదిలి మళ్లీ ప్రయత్నించండి లేదా commodity మార్చండి.</div>
                        <div class="panel-action-row"><button class="mini-btn" onclick="openAgmarknetOfficial()" type="button">Official AGMARKNET Open</button></div>`);
                    return;
                }
                const rows = records.slice(0,12).map(r => `<tr>
                    <td>${r.arrival_date || '-'}</td>
                    <td>${r.district || '-'}<br><small>${r.market || ''}</small></td>
                    <td>${r.commodity || '-'}<br><small>${r.variety || ''}</small></td>
                    <td><span class="price-badge">₹${r.min_price || '-'}</span></td>
                    <td><span class="price-badge">₹${r.max_price || '-'}</span></td>
                    <td><span class="price-badge">₹${r.modal_price || '-'}</span></td>
                </tr>`).join('');
                showBox('marketOutput', `<b>✅ Live Mandi Prices Found</b>
                    <div class="market-status-line">Source: Official Data.gov.in AGMARKNET dataset. Prices usually ₹/quintal.</div>
                    <table class="market-price-table">
                        <thead><tr><th>Date</th><th>District / Market</th><th>Commodity</th><th>Min</th><th>Max</th><th>Modal</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div class="source-line">Note: Some mandis update late. Final sale price depends on quality, variety, moisture and local demand.</div>`);
            } catch (error) {
                showBox('marketOutput', `<b>Live API browser లో load కాలేదు.</b><br>
                    <div class="market-status-line">ఇది సాధారణంగా CORS/API availability వల్ల వస్తుంది. Official AGMARKNET button ఉపయోగించండి. Website hosting తర్వాత backend proxy జోడిస్తే 100% reliable అవుతుంది.</div>
                    <div class="panel-action-row"><button class="mini-btn" onclick="openAgmarknetOfficial()" type="button">Official AGMARKNET Open</button></div>`);
            }
        }

        function openAgmarknetOfficial() {
            window.open('https://agmarknet.gov.in/', '_blank', 'noopener,noreferrer');
        }

        async function loadFarmerNews() {
            const out = document.getElementById('farmerNewsOutput');
            if (!out) return;
            showBox('farmerNewsOutput', '⏳ తాజా వ్యవసాయ వార్తలు తెస్తున్నాం...');
            const lang = document.getElementById('newsLanguage')?.value || 'en-IN';
            const query = lang === 'te-IN' ? 'Andhra Pradesh farmers agriculture schemes crop weather mandi prices' : 'India farmers agriculture schemes crop weather mandi prices';
            const rss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
            const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;
            try {
                const res = await fetch(api, { cache: 'no-store' });
                if (!res.ok) throw new Error('RSS fetch failed');
                const data = await res.json();
                const items = (data.items || []).slice(0, 8);
                if (!items.length) throw new Error('No news items');
                const html = items.map((item,i) => {
                    const date = item.pubDate ? new Date(item.pubDate).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : '';
                    const source = item.author || 'Google News';
                    return `<div class="news-item-live" style="animation-delay:${i*0.06}s">
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
                        <span class="news-meta-live">${date} • ${source}</span>
                    </div>`;
                }).join('');
                showBox('farmerNewsOutput', `<b>✅ Auto Updated Farmer News</b>${html}<div class="source-line">Source: Google News RSS. Refresh button click చేస్తే latest updates వస్తాయి.</div>`);
            } catch (e) {
                showBox('farmerNewsOutput', `<b>Auto news load కాలేదు.</b><br>
                    <div class="news-item-live"><a href="https://news.google.com/search?q=India%20farmers%20agriculture%20schemes%20crop%20weather%20mandi%20prices" target="_blank" rel="noopener noreferrer">Google News లో తాజా రైతు వార్తలు చూడండి</a></div>
                    <div class="news-item-live"><a href="https://agricoop.gov.in/" target="_blank" rel="noopener noreferrer">Ministry of Agriculture official updates</a></div>
                    <div class="news-item-live"><a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer">AGMARKNET market updates</a></div>`);
            }
        }

        const farmerKnowledgeBase = {
            paddy: {
                name: 'వరి',
                tips: 'నిల్వ నీరు 2–5 సెం.మీ. వరకు సరిపోతుంది; అధిక నీరు నిలిస్తే వేర్లకు ఆక్సిజన్ తగ్గుతుంది. Brown/leaf spot కనిపిస్తే పొలం గాలి ప్రసరణ, నీటి నిర్వహణ, సమతుల్య ఎరువు ముఖ్యం.'
            },
            tomato: {
                name: 'టమాటో',
                tips: 'కింద ఆకులు పసుపు + గోధుమ/నల్ల మచ్చలు ఉంటే fungal leaf spot/early blight అవకాశం ఉంటుంది. ఆకులపై నీరు ఎక్కువసేపు ఉండకుండా చూడండి, ప్రభావిత ఆకులు తొలగించండి, డ్రిప్/మట్టికి నీరు ఇవ్వడం మంచిది.'
            },
            chilli: {
                name: 'మిర్చి',
                tips: 'తామర పురుగు/మైట్స్ వల్ల ఆకులు ముడుచుకోవడం, పూలు రాలడం రావచ్చు. Yellow/blue sticky traps, పొలం శుభ్రత, సరైన నీటి నిర్వహణ ఉపయోగపడతాయి.'
            },
            groundnut: {
                name: 'వేరుశెనగ',
                tips: 'ఆకులపై గోధుమ మచ్చలు ఉంటే tikka/leaf spot అవకాశం ఉంటుంది. గాలి ప్రసరణ, crop rotation, వ్యాధి ఆకులు తగ్గించడం ఉపయోగపడుతుంది.'
            },
            mango: {
                name: 'మామిడి',
                tips: 'పూల దశలో తడి/మబ్బు ఎక్కువైతే powdery mildew/anthracnose ప్రమాదం పెరుగుతుంది. తోటలో గాలి ప్రసరణ, ఎండిన కొమ్మల pruning ముఖ్యం.'
            },
            general: {
                name: 'సాధారణ పంట',
                tips: 'సమస్యను ఖచ్చితంగా చెప్పడానికి పంట పేరు, వయస్సు, నీటి పరిస్థితి, చివరిగా వేసిన ఎరువు/మందు, ఫోటో అవసరం.'
            }
        };

        function fillAIQuestion(text) {
            document.getElementById('aiQuestion').value = text;
        }

        function clearFarmerAI() {
            document.getElementById('aiQuestion').value = '';
            document.getElementById('aiCrop').value = 'general';
            document.getElementById('aiStage').value = 'unknown';
            document.getElementById('aiIssue').value = 'general';
            document.getElementById('aiAnswer').innerHTML = '👋 మీ పంట వివరాలు ఎంచుకుని సమస్య రాయండి. నేను కారణాలు, వెంటనే చేయాల్సినవి, నివారణ, ఎప్పుడు అధికారిని సంప్రదించాలో చెప్తాను.';
        }

        function detectKeywords(q) {
            const text = q.toLowerCase();
            return {
                yellow: /yellow|పసుపు|పచ్చబడ|పాలిపోయ/.test(text),
                spots: /spot|spots|మచ్చ|మచ్చలు|నల్ల|గోధుమ/.test(text),
                wilt: /wilt|వాడి|వాడిపో|ఎండిపో|droop/.test(text),
                pest: /pest|పురుగు|తామర|aphid|mites|thrips|whitefly|చీడ/.test(text),
                water: /water|నీరు|వర్షం|rain|తడి|నిలిచ/.test(text),
                flower: /flower|పూలు|пувву|రాలిపో/.test(text),
                fertilizer: /fertilizer|ఎరువు|urea|యూరియా|dap|పొటాష్|npk/.test(text),
                market: /price|ధర|market|మార్కెట్|అమ్మ/.test(text)
            };
        }

        function askFarmerAI() {
            const q = document.getElementById('aiQuestion').value.trim();
            const crop = document.getElementById('aiCrop').value;
            const stage = document.getElementById('aiStage').value;
            const issue = document.getElementById('aiIssue').value;
            const ans = document.getElementById('aiAnswer');
            if (!q && issue === 'general') {
                ans.innerHTML = 'దయచేసి పంట సమస్యను టైప్ చేయండి లేదా సమస్య రకం ఎంచుకోండి.';
                return;
            }

            const kb = farmerKnowledgeBase[crop] || farmerKnowledgeBase.general;
            const k = detectKeywords(q + ' ' + issue);
            const stageText = {
                unknown: 'దశ తెలియదు', nursery: 'నర్సరీ/విత్తనం', vegetative: 'ఆకుల పెరుగుదల', flowering: 'పూల దశ', fruiting: 'కాయ/గింజ దశ', harvest: 'కోత దశ'
            }[stage];

            let probable = [];
            let immediate = [];
            let prevention = [];
            let questions = [];

            if (k.yellow) {
                probable.push('ఆకులు పసుపు కావడం: నీరు ఎక్కువ/తక్కువ, నైట్రోజన్ లోపం, వేర్ల సమస్య లేదా వ్యాధి మొదటి లక్షణం కావచ్చు.');
                immediate.push('మట్టిలో తేమ చూడండి; నీరు నిలిచితే బయటకు వెళ్లే మార్గం చేయండి.');
                immediate.push('కొత్త ఆకులా పాత ఆకులా పసుపు అవుతున్నాయో గమనించండి.');
            }
            if (k.spots) {
                probable.push('ఆకుల మచ్చలు: fungal/bacterial leaf spot అవకాశం ఉంటుంది, ముఖ్యంగా వర్షం లేదా తడి తర్వాత పెరిగితే.');
                immediate.push('తీవ్రంగా దెబ్బతిన్న ఆకులు తీసి పొలం బయట పూడ్చండి/నాశనం చేయండి.');
                prevention.push('ఆకులపై నీరు చల్లకుండా మట్టికి నీరు ఇవ్వండి; మొక్కల మధ్య గాలి ప్రసరణ ఉండాలి.');
            }
            if (k.wilt) {
                probable.push('మొక్క వాడిపోవడం: వేర్ల కుళ్లు, నీటి stress, bacterial wilt లేదా stem damage కారణం కావచ్చు.');
                immediate.push('ఒక మొక్కను తీసి వేర్లు నల్లగా/కుళ్లుగా ఉన్నాయా చూడండి.');
                immediate.push('అదే వరుసలో ఎన్నిమొక్కలు ప్రభావితమయ్యాయో గుర్తించండి.');
            }
            if (k.pest) {
                probable.push('పురుగు దాడి: thrips/aphids/whitefly/mites వంటి చీడలు ఆకులు ముడుచుకోవడం, పూలు రాలడం, virus వ్యాప్తికి కారణం కావచ్చు.');
                immediate.push('ఆకు అడుగు భాగం చూడండి; sticky traps పెట్టండి; కలుపు మొక్కలు తొలగించండి.');
                prevention.push('ఒకే మందు మళ్లీ మళ్లీ వాడకండి; pest resistance తగ్గించడానికి స్థానిక అధికారి సూచన పాటించండి.');
            }
            if (k.water) {
                probable.push('నీటి సమస్య: అధిక తడి వల్ల fungal diseases, వేర్ల ఆక్సిజన్ లోపం; తక్కువ నీరు వల్ల wilting/flower drop రావచ్చు.');
                immediate.push('పొలంలో నీరు నిల్వ ఉండకుండా drainage చేయండి; ఉదయం సమయంలో irrigation ఇవ్వడం మంచిది.');
            }
            if (k.flower) {
                probable.push('పూలు రాలడం: heat stress, water stress, pollination సమస్య, thrips/mites లేదా nutrient imbalance వల్ల రావచ్చు.');
                immediate.push('పూల దశలో నీటి stress రాకుండా చూడండి; pest scouting రోజూ చేయండి.');
            }
            if (k.fertilizer) {
                probable.push('ఎరువు సమస్య: ఎక్కువ యూరియా వేస్తే ఆకులు ఎక్కువగా పెరిగి పూలు/కాయలు తగ్గవచ్చు; తక్కువ nutrients వల్ల yellowing రావచ్చు.');
                immediate.push('Soil test లేకుండా అధిక ఎరువు వేయకండి; split dose పద్ధతి పాటించండి.');
                prevention.push('NPK తో పాటు సేంద్రియ పదార్థం, సూక్ష్మ పోషకాలు అవసరమైతే మాత్రమే వాడండి.');
            }
            if (k.market) {
                probable.push('మార్కెట్ నిర్ణయం: కోత సమయం, నాణ్యత grading, సమీప మార్కెట్ ధర, రవాణా ఖర్చు చూసి అమ్మకం నిర్ణయించాలి.');
                immediate.push('ఈరోజు స్థానిక మార్కెట్ ధర, రైతు బజార్/మండీ ధర, క్వాలిటీ గ్రేడ్ పోల్చండి.');
            }
            if (probable.length === 0) {
                probable.push(kb.tips);
                immediate.push('సమస్య ఫోటో, పంట వయస్సు, ఎరువు/మందు చరిత్ర, నీటి వివరాలు నమోదు చేయండి.');
            }

            if (crop !== 'general') prevention.unshift(kb.tips);
            questions.push('పంట వయస్సు ఎన్ని రోజులు?');
            questions.push('సమస్య ఎన్ని మొక్కల్లో ఉంది: కొన్ని మాత్రమేనా లేదా మొత్తం పొలమా?');
            questions.push('చివరిగా ఏ ఎరువు/మందు వేసారు, ఎప్పుడు వేసారు?');

            ans.innerHTML = `
                <span class="ai-result-title">🌾 ${kb.name} — Reality Based Assistant</span>
                <b>దశ:</b> ${stageText}<br><br>
                <b>1) సాధ్యమైన కారణాలు</b><br>• ${probable.slice(0,4).join('<br>• ')}<br><br>
                <b>2) వెంటనే చేయాల్సినవి</b><br>• ${immediate.slice(0,5).join('<br>• ')}<br><br>
                <b>3) నివారణ / నిర్వహణ</b><br>• ${(prevention.length ? prevention : ['పంట మార్పిడి, పొలం శుభ్రత, సరైన నీటి నిర్వహణ, balanced fertilizer పాటించండి.']).slice(0,4).join('<br>• ')}<br><br>
                <b>4) ఖచ్చితంగా తెలుసుకోవడానికి అవసరమైన వివరాలు</b><br>• ${questions.join('<br>• ')}
                <div class="ai-safe-note">ఈ assistant practical guidance మాత్రమే ఇస్తుంది. Chemical spray పేరు/doseను local Agriculture Officer/KVK లేదా product label ఆధారంగా మాత్రమే నిర్ణయించండి.</div>
            `;
        }

        function previewCropDiseaseImage() {
            const input = document.getElementById('cropImageInput');
            const box = document.getElementById('cropPreviewBox');
            const out = document.getElementById('diseaseOutput');
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = e => { box.innerHTML = `<img src="${e.target.result}" alt="Crop image preview">`; };
                reader.readAsDataURL(file);
                out.style.display = 'block';
                out.innerHTML = `✅ ఫోటో ఎంపికైంది: <b>${file.name}</b>. ఇప్పుడు symptoms select చేసి Disease Check క్లిక్ చేయండి.`;
            }
        }

        const diseaseRules = {
            tomato: {
                brown_spots: ['Early blight / Leaf spot అవకాశం', 'ప్రభావిత కింది ఆకులు తొలగించండి; ఆకులపై నీరు నిల్వ కాకుండా drip/soil irrigation చేయండి.'],
                yellow: ['Nutrient deficiency / water stress / root issue', 'మట్టితేమ, drainage, చివరిగా వేసిన nitrogen dose చెక్ చేయండి.'],
                white_powder: ['Powdery mildew అవకాశం', 'గాలి ప్రసరణ పెంచండి; అధిక తడి/దగ్గర దగ్గర నాటడం తగ్గించండి.'],
                wilting: ['Bacterial wilt / root rot / water stress', 'ఒక మొక్క తీసి వేర్లు, కాండం లోపల రంగు చెక్ చేసి స్థానిక అధికారికి చూపండి.']
            },
            paddy: {
                brown_spots: ['Brown spot / blast possibility', 'నీటి నిల్వ, nitrogen imbalance, గాలి ప్రసరణ పరిశీలించండి.'],
                yellow: ['Nitrogen deficiency / water management issue', 'పొలంలో నీటి స్థాయి, మట్టి పరీక్ష ఆధారంగా ఎరువు ప్లాన్ చెక్ చేయండి.'],
                wilting: ['Root stress / stem borer possibility', 'కాండం దగ్గర రంధ్రాలు/లార్వా ఉన్నాయా చూడండి.']
            },
            chilli: {
                curling: ['Thrips/mites/virus complex అవకాశం', 'ఆకు అడుగు భాగం చూడండి; sticky traps పెట్టండి; affected plants monitor చేయండి.'],
                flower_drop: ['Heat/water stress or thrips', 'పూల దశలో నీటి stress రాకుండా చూడండి; pest scouting చేయండి.'],
                insects: ['Thrips/aphids/whitefly possibility', 'Yellow/blue sticky traps, కలుపు తొలగింపు, local officer advice.']
            },
            groundnut: {
                brown_spots: ['Tikka leaf spot అవకాశం', 'Crop rotation, గాలి ప్రసరణ, వ్యాధి ఆకులు తగ్గించడం ముఖ్యం.'],
                yellow: ['Nutrient deficiency / moisture stress', 'మట్టి తేమ, gypsum/calcium requirement local advice తో చెక్ చేయండి.']
            },
            mango: {
                white_powder: ['Powdery mildew possibility', 'పూల దశలో తడి/మబ్బు ఎక్కువైతే risk పెరుగుతుంది; pruning/good aeration.'],
                brown_spots: ['Anthracnose / fruit spot possibility', 'ఎండిన కొమ్మలు తొలగించండి; తోటలో గాలి ప్రసరణ పెంచండి.']
            }
        };

        function getCheckedSymptoms() {
            return Array.from(document.querySelectorAll('.symptom-check-grid input:checked')).map(x => x.value);
        }

        function runRealisticDiseaseCheck() {
            const crop = document.getElementById('diseaseCrop').value;
            const part = document.getElementById('diseasePart').value;
            const weather = document.getElementById('diseaseWeather').value;
            const notes = document.getElementById('diseaseNotes').value.trim();
            const symptoms = getCheckedSymptoms();
            const out = document.getElementById('diseaseOutput');
            out.style.display = 'block';
            if (!symptoms.length && !notes) {
                out.innerHTML = 'దయచేసి కనీసం ఒక symptom select చేయండి లేదా వివరాలు రాయండి.';
                return;
            }
            const rules = diseaseRules[crop] || {};
            let matches = [];
            symptoms.forEach(s => { if (rules[s]) matches.push({symptom:s, title:rules[s][0], action:rules[s][1]}); });
            if (symptoms.includes('holes')) matches.push({title:'Leaf eating caterpillar / beetle damage అవకాశం', action:'ఆకు అడుగు భాగం మరియు సాయంత్రం సమయంలో పురుగులు చూడండి; చేతితో తొలగింపు/field scouting చేయండి.'});
            if (symptoms.includes('insects')) matches.push({title:'Pest infestation possibility', action:'Sticky traps, field sanitation, affected leaves observation; chemical dose మాత్రం local expert/product label ప్రకారం.'});
            if (!matches.length) matches.push({title:'Mixed stress / early disease stage', action:'Clear close-up photo, full plant photo, field spread detailsతో RBK/KVK/Agriculture Officer వద్ద verify చేయండి.'});
            const risk = Math.min(90, 25 + symptoms.length * 10 + (weather === 'wet' ? 15 : 0) + (symptoms.includes('wilting') ? 15 : 0));
            const riskText = risk >= 70 ? 'High — త్వరగా expert check మంచిది' : risk >= 45 ? 'Medium — 2-3 రోజులు దగ్గరగా గమనించండి' : 'Low/Medium — early stage కావచ్చు';
            out.innerHTML = `
                <b>🔬 Realistic Disease Check Result</b>
                <div class="disease-risk-meter"><div class="disease-risk-fill" style="width:${risk}%"></div></div>
                <b>Risk:</b> ${riskText}<br>
                <div class="diagnosis-card"><b>Possible diagnosis</b><br>• ${matches.map(m => m.title).slice(0,4).join('<br>• ')}</div>
                <div class="diagnosis-card"><b>Immediate practical steps</b><br>• ${matches.map(m => m.action).slice(0,5).join('<br>• ')}<br>• ప్రభావిత మొక్కల ఫోటోలు: close-up + full plant + field view తీసుకోండి.</div>
                <div class="diagnosis-card"><b>Safety note</b><br>Chemical spray పేరు/dose నేను guess చేయను. Label dose, waiting period, gloves/mask, local Agriculture Officer/KVK సూచన తప్పనిసరి.</div>
                <div class="source-line">Part checked: ${part}. Weather condition: ${weather}. ${notes ? 'Notes saved: '+notes : ''}</div>`;
        }

        function connectCropHealthAPIInfo() {
            showBox('diseaseOutput', `
                <b>AI Image API setup</b><br>
                Real image disease detection కోసం Plantix / Crop.health / PlantNet disease API లాంటి service API key అవసరం.<br>
                Browserలో API key పెట్టకండి. Backend endpoint create చేసి image upload → AI API → result return చేయాలి.<br>
                <small>ఇప్పుడున్న checker symptoms ఆధారంగా safe practical guidance ఇస్తుంది.</small>`);
        }

        function calculateSimpleInterest() {
            const principal = Number(document.getElementById('siPrincipal').value);
            const rate = Number(document.getElementById('siRate').value);
            const timeValue = Number(document.getElementById('siTime').value);
            const unit = document.getElementById('siTimeUnit').value;

            if (!principal || !rate || !timeValue) {
                showBox('calcOutput', 'దయచేసి Principal Amount, Interest Rate, Time అన్నీ ఎంటర్ చేయండి.');
                return;
            }

            const timeInYears = unit === 'months' ? timeValue / 12 : timeValue;
            const interest = (principal * rate * timeInYears) / 100;
            const total = principal + interest;

            showBox('calcOutput', `
                <b>Simple Interest Result</b>
                <div class="interest-result-grid">
                    <div class="interest-result-box">
                        <span class="interest-result-label">Simple Interest</span>
                        <span class="interest-result-value">₹${interest.toFixed(2)}</span>
                    </div>
                    <div class="interest-result-box">
                        <span class="interest-result-label">Total Amount</span>
                        <span class="interest-result-value">₹${total.toFixed(2)}</span>
                    </div>
                    <div class="interest-result-box">
                        <span class="interest-result-label">Principal</span>
                        <span class="interest-result-value">₹${principal.toFixed(2)}</span>
                    </div>
                    <div class="interest-result-box">
                        <span class="interest-result-label">Time Used</span>
                        <span class="interest-result-value">${timeInYears.toFixed(2)} Years</span>
                    </div>
                </div>
                <small>Formula: SI = (P × R × T) / 100</small>
            `);
        }

        function clearSimpleInterest() {
            ['siPrincipal', 'siRate', 'siTime'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            const out = document.getElementById('calcOutput');
            if (out) {
                out.style.display = 'none';
                out.innerHTML = '';
            }
        }

        function openGoogleTranslateText() {
            const input = document.getElementById('translateInput');
            const from = document.getElementById('translateFrom').value;
            const to = document.getElementById('translateTo').value;
            const text = input ? input.value.trim() : '';

            if (!text) {
                showBox('translatorOutput', 'దయచేసి translate చేయాల్సిన text ఎంటర్ చేయండి.');
                return;
            }

            const url = `https://translate.google.com/?sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}&op=translate`;
            showBox('translatorOutput', `✅ Google Translate కొత్త tabలో open అవుతుంది.<br><small>Popup block అయితే ఈ link క్లిక్ చేయండి:</small><br><a href="${url}" target="_blank" rel="noopener">Open Translation</a>`);
            window.open(url, '_blank', 'noopener');
        }

        function openFeatureModal(title, body) {
            document.getElementById('featureModalTitle').innerText = title;
            document.getElementById('featureModalBody').innerText = body;
            document.getElementById('featureModal').classList.add('active');
        }

        function closeFeatureModal() {
            document.getElementById('featureModal').classList.remove('active');
        }

        document.getElementById('featureModal').addEventListener('click', (e) => {
            if (e.target.id === 'featureModal') closeFeatureModal();
        });

        function showFeatureTab(featureName, clickedBtn) {
            const grid = document.getElementById('featuresGrid');
            if (!grid) return;

            document.querySelectorAll('.feature-tab-btn').forEach(btn => btn.classList.remove('active-tab'));
            if (clickedBtn) clickedBtn.classList.add('active-tab');

            document.querySelectorAll('#featuresGrid .feature-card').forEach(card => {
                card.classList.remove('feature-tab-active');
                if (card.dataset.feature === featureName) {
                    card.classList.add('feature-tab-active');
                }
            });

            const schemesPanel = document.getElementById('governmentSchemesPanel');
            const donationPanel = document.getElementById('donationTemplatePanel');
            if (schemesPanel) schemesPanel.classList.toggle('open', featureName === 'schemes');
            if (donationPanel) donationPanel.classList.toggle('open', featureName === 'donation');

            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.addEventListener('DOMContentLoaded', () => {
            const activeButton = document.querySelector('.feature-tab-btn.active-tab') || document.querySelector('.feature-tab-btn');
            if (activeButton && !document.querySelector('#featuresGrid .feature-card.feature-tab-active')) {
                activeButton.click();
            }
        });

        let selectedDonationAmount = 10;
        const demoDonorsDefault = [
            { name:'Ramesh Kumar', amount:500, mode:'Google Pay / PhonePe / Paytm', time:'Just now' },
            { name:'M. Lakshmi', amount:250, mode:'Bank Transfer', time:'10 min ago' },
            { name:'Venkat Naik', amount:1000, mode:'Google Pay / PhonePe / Paytm', time:'25 min ago' },
            { name:'Sai Kiran', amount:100, mode:'Cash Collection', time:'1 hour ago' },
            { name:'Anusha', amount:750, mode:'Google Pay / PhonePe / Paytm', time:'2 hours ago' },
            { name:'Kiran Kumar', amount:50, mode:'Bank Transfer', time:'Today' }
        ];

        function getDonationDonors() {
            try {
                return JSON.parse(localStorage.getItem('grmbDonationDonors')) || demoDonorsDefault;
            } catch (e) {
                return demoDonorsDefault;
            }
        }

        function saveDonationDonors(donors) {
            localStorage.setItem('grmbDonationDonors', JSON.stringify(donors));
        }

        function renderDonationDonors() {
            const latestBox = document.getElementById('latestDonorsList');
            const topBox = document.getElementById('topDonorsList');
            if (!latestBox || !topBox) return;

            const donors = getDonationDonors();
            const latestDonors = donors.slice(0, 5);
            const topDonors = [...donors].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5);

            const makeRow = (donor, index) => `
                <div class="donor-row">
                    <div class="donor-info">
                        <span class="donor-rank-badge">${index + 1}</span>
                        <div>
                            <div class="donor-name">${donor.name}</div>
                            <div class="donor-time">${donor.time || 'Today'} • ${donor.mode || 'UPI'}</div>
                        </div>
                    </div>
                    <div class="donor-amount">₹${Number(donor.amount).toLocaleString('en-IN')}</div>
                </div>`;

            latestBox.innerHTML = latestDonors.map(makeRow).join('');
            topBox.innerHTML = topDonors.map(makeRow).join('');
        }

        document.addEventListener('DOMContentLoaded', renderDonationDonors);
        function toggleGovernmentSchemes(force) {
            const panel = document.getElementById('governmentSchemesPanel');
            if (!panel) return;
            const shouldOpen = typeof force === 'boolean' ? force : !panel.classList.contains('open');
            panel.classList.toggle('open', shouldOpen);
            if (shouldOpen) setTimeout(() => panel.scrollIntoView({behavior:'smooth', block:'nearest'}), 120);
        }

        function toggleDonationTemplate(force) {
            const panel = document.getElementById('donationTemplatePanel');
            if (!panel) return;
            const shouldOpen = typeof force === 'boolean' ? force : !panel.classList.contains('open');
            panel.classList.toggle('open', shouldOpen);
            if (shouldOpen) setTimeout(() => panel.scrollIntoView({behavior:'smooth', block:'nearest'}), 120);
        }

        function selectDonationAmount(amount, btn) {
            selectedDonationAmount = amount;
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
            if (btn) btn.classList.add('selected');
            const msg = document.getElementById('donationMessage');
            if (msg) msg.innerHTML = `మీరు ₹${amount} ఎంచుకున్నారు. Payment పూర్తి చేసిన తర్వాత confirm demo క్లిక్ చేయండి.`;
        }

        function submitDonationDemo() {
            const nameInput = document.getElementById('donorName');
            const mobileInput = document.getElementById('donorMobile');
            const modeInput = document.getElementById('donationMode');
            const name = nameInput.value.trim() || 'Anonymous Donor';
            const mode = modeInput ? modeInput.value : 'UPI';
            const amount = document.getElementById('donationAmount');
            const donors = document.getElementById('donorCount');

            amount.textContent = Number(amount.textContent) + selectedDonationAmount;
            donors.textContent = Number(donors.textContent) + 1;

            const donorList = getDonationDonors();
            donorList.unshift({
                name,
                amount:selectedDonationAmount,
                mode,
                time:new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
            });
            saveDonationDonors(donorList.slice(0, 50));
            renderDonationDonors();

            document.getElementById('donationMessage').innerHTML = `✅ ధన్యవాదాలు ${name}! ₹${selectedDonationAmount} donation demo counter, Latest Donors మరియు Top 5 Donors లో add అయ్యింది.`;
            nameInput.value = '';
            mobileInput.value = '';
        }

        function copyUPIText() {
            const upi = document.getElementById('upiText')?.innerText || 'grmbtrust@upi';
            navigator.clipboard?.writeText(upi);
            const msg = document.getElementById('donationMessage');
            if (msg) msg.innerHTML = `✅ UPI ID copied: <b>${upi}</b>`;
        }

        // ===================================================
        // 6. పూర్తి ఫంక్షనల్ AJAX ఫారమ్ సబ్మిషన్ లాజిక్
        // ===================================================
        const submitBtn = document.getElementById('submitFormBtn');
        const btnText = document.getElementById('btnText');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            if (contactForm.getAttribute('action').includes('YOUR_FORM_ID')) {
                alert('దయచేసి కోడ్‌లో YOUR_FORM_ID స్థానంలో మీ ఫార్మ్‌ప్రీ ఐడిని సెట్ చేయండి!');
                return;
            }

            submitBtn.disabled = true;
            btnText.innerText = "సమర్పిస్తోంది...";

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('ధన్యవాదాలు! మీ వివరాలు విజయవంతంగా మాకు చేరాయి.');
                    contactForm.reset(); 
                    interactiveContactCard.classList.remove('show-now'); 
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('క్షమించండి! డేటా పంపడంలో సమస్య వచ్చింది. మళ్లీ ప్రయత్новниచండి.');
                        }
                    })
                }
            })
            .catch(error => {
                alert('నెట్‌వర్క్ సమస్య! దయచేసి ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేసుకోండి.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                btnText.innerText = "డేటా సమర్పించండి";
            });
        });

        const originalShowFeatureTab = typeof showFeatureTab === 'function' ? showFeatureTab : null;
        if (originalShowFeatureTab) {
            showFeatureTab = function(featureName, clickedBtn) {
                originalShowFeatureTab(featureName, clickedBtn);
                if (featureName === 'news') setTimeout(loadFarmerNews, 150);
            }
        }




        
// Top-right full website language translator
// Original page language is Telugu. Every browser refresh starts in Telugu.
const WEBSITE_LANGUAGES = ['te', 'en', 'hi', 'kn', 'ta', 'ml', 'mr', 'bn'];

function eraseTranslateCookie(name) {
    const host = location.hostname;
    const parts = host.split('.');
    const domains = ['', host, '.' + host];
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    domains.forEach(domain => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` + (domain ? `; domain=${domain}` : '');
    });
}

function setTranslateCookie(languageCode) {
    const value = `/te/${languageCode}`;
    const host = location.hostname;
    const parts = host.split('.');
    const domains = ['', host, '.' + host];
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    domains.forEach(domain => {
        document.cookie = `googtrans=${value}; path=/; max-age=31536000` + (domain ? `; domain=${domain}` : '');
    });
}

function waitForTranslateCombo(callback, attempts = 0) {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
        callback(combo);
        return;
    }
    if (attempts >= 100) {
        const status = document.getElementById('translationStatus');
        if (status) status.textContent = 'Translator loading failed';
        document.documentElement.classList.remove('page-translating');
        return;
    }
    setTimeout(() => waitForTranslateCombo(callback, attempts + 1), 150);
}

function changeWebsiteLanguage(languageCode) {
    const selector = document.getElementById('websiteLanguageSelect');
    const status = document.getElementById('translationStatus');

    if (!WEBSITE_LANGUAGES.includes(languageCode)) languageCode = 'te';
    if (selector) selector.value = languageCode;

    document.documentElement.classList.add('page-translating');

    if (languageCode === 'te') {
        if (status) status.textContent = 'Telugu default';
        eraseTranslateCookie('googtrans');
        try { localStorage.removeItem('websiteLanguage'); localStorage.removeItem('selectedLanguage'); } catch(e) {}
        setTimeout(() => window.location.reload(), 220);
        return;
    }

    if (status) status.textContent = 'Translating...';
    setTranslateCookie(languageCode);

    waitForTranslateCombo((combo) => {
        combo.value = languageCode;
        combo.dispatchEvent(new Event('change'));
        combo.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
            document.documentElement.classList.remove('page-translating');
            if (status) status.textContent = 'Translated';
        }, 1100);
    });
}

window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'te',
        includedLanguages: 'en,hi,kn,ta,ml,mr,bn',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
    }, 'google_translate_element');
};

document.addEventListener('DOMContentLoaded', () => {
    // Refresh always starts in Telugu because index.html clears Google Translate cookies before render.
    const selector = document.getElementById('websiteLanguageSelect');
    const status = document.getElementById('translationStatus');
    if (selector) {
        selector.value = 'te';
        selector.addEventListener('change', () => changeWebsiteLanguage(selector.value));
    }
    if (status) status.textContent = 'Telugu default';
});
