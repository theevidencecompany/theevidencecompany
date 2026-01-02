    // ---------------------------
    // Utilities (internal math; no formula display)
    // ---------------------------

    // Inverse standard normal CDF (Acklam approximation)
    function normInv(p){
      if(!(p>0 && p<1)) return NaN;
      const a=[-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
      const b=[-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
      const c=[-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
      const d=[7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
      const plow=0.02425, phigh=1-plow;
      let q, r;
      if(p < plow){
        q=Math.sqrt(-2*Math.log(p));
        return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
               ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
      }
      if(p > phigh){
        q=Math.sqrt(-2*Math.log(1-p));
        return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
                ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
      }
      q=p-0.5;
      r=q*q;
      return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
             (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
    }

    function clamp(n,min,max){return Math.min(max, Math.max(min, n));}

    const nf = new Intl.NumberFormat('en-US', {
      maximumSignificantDigits: 7,
      useGrouping: false
    });

    function fmt(x){
      if(x === Infinity) return '∞';
      if(x === -Infinity) return '−∞';
      if(x === 0) return '0';
      if(x === null || x === undefined) return '—';
      if(typeof x !== 'number' || !isFinite(x)) return '—';
      return nf.format(x);
    }

    function toNumberOrNaN(s){
      if(s === null || s === undefined) return NaN;
      const t = String(s).trim();
      if(t === '') return NaN;
      const n = Number(t);
      return Number.isFinite(n) ? n : NaN;
    }

    function splitList(raw){
      const s = (raw ?? '').trim();
      if(!s) return [];
      let parts = s.split(',').map(x => x.trim());
      while(parts.length && parts[parts.length-1] === '') parts.pop();
      return parts;
    }

    function parseList(raw){
      const tokens = splitList(raw);
      return tokens.map(t => ({ raw: t, val: toNumberOrNaN(t), ok: Number.isFinite(toNumberOrNaN(t)) }));
    }

    function icon(status){
      if(status === 'ok'){
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      }
      if(status === 'warn'){
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 9v4" stroke="#b45309" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M12 17h.01" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
          <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke="#b45309" stroke-width="2"/>
        </svg>`;
      }
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8v5" stroke="#b91c1c" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M12 16h.01" stroke="#b91c1c" stroke-width="3" stroke-linecap="round"/>
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#b91c1c" stroke-width="2"/>
      </svg>`;
    }

    // ---------------------------
    // State
    // ---------------------------
    const state = {
      mode: 'm1',
      sided: 'two',
      tail: 'left',
      conf: 95,
      cc: false,
      parsedFile: null,
      results: [],
      lastCsv: ''
    };

    // clearResults is referenced by several UI listeners; define it up-front so it is always in scope.
    // It will be replaced with the real implementation once the tool wiring is initialized.
    let clearResults = function(){ };

    // ---------------------------
    // DOM
    // ---------------------------
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const logoImg = document.getElementById('logoImg');
    const logoFallback = document.getElementById('logoFallback');
    logoImg.addEventListener('error', () => {
      logoImg.style.display='none';
      logoFallback.style.display='block';
    });

    const modeBadge = document.getElementById('modeBadge');
    const manualInputs = document.getElementById('manualInputs');
    const fieldErrors = document.getElementById('fieldErrors');

    const sidedToggle = document.getElementById('sidedToggle');
    const tailField = document.getElementById('tailField');
    const tailToggle = document.getElementById('tailToggle');

    const confRange = document.getElementById('confRange');
    const confNum = document.getElementById('confNum');

    const ccToggleLine = document.getElementById('ccToggleLine');
    const ccToggle = document.getElementById('ccToggle');

    const assumptionWarnings = document.getElementById('assumptionWarnings');
    const assumptionList = document.getElementById('assumptionList');
    const assumeBadge = document.getElementById('assumeBadge');

    const rowPill = document.getElementById('rowPill');
    const zPill = document.getElementById('zPill');
    const lengthNote = document.getElementById('lengthNote');

    const runBtn = document.getElementById('runBtn');
    const copyBtn = document.getElementById('copyBtn');
    const dlBtn = document.getElementById('dlBtn');
    const resetBtn = document.getElementById('resetBtn');

    const resultsTable = document.getElementById('resultsTable');

    // Upload
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');
    const fileInput = document.getElementById('fileInput');
    const fileStatus = document.getElementById('fileStatus');

    // Column modal
    const colModalBack = document.getElementById('colModalBack');
    const colSelectors = document.getElementById('colSelectors');
    const colClose = document.getElementById('colClose');
    const colCancel = document.getElementById('colCancel');
    const applyCols = document.getElementById('applyCols');
    const hasHeader = document.getElementById('hasHeader');
    const filePreviewMeta = document.getElementById('filePreviewMeta');
    const colPreview = document.getElementById('colPreview');

    // Column modal header toggle (single stable listener; avoids stacking once-handlers)
    hasHeader.addEventListener('change', () => {
      if(state.parsedFile) openColumnPicker();
    });

    // Info modal
    const infoModalBack = document.getElementById('infoModalBack');
    const infoClose = document.getElementById('infoClose');
    const infoTitle = document.getElementById('infoTitle');
    const infoImg = document.getElementById('infoImg');
    const infoText = document.getElementById('infoText');

    // Info buttons
    const infoTwoOne = document.getElementById('infoTwoOne');
    const infoTail = document.getElementById('infoTail');

    // ---------------------------
    // Info modal wiring (infographics)
    // ---------------------------
    const TWO_ONE_SIDED_TEXT = "Choosing the right interval depends on whether you need to account for deviations in both directions or just one. A two-sided interval is used when any change is relevant, like testing if a new medication changes blood pressure either higher or lower than the current standard. A one-sided interval is used when you only care about a specific directional benefit, such as verifying that a new car battery lasts longer than the previous model.";

    const ONE_SIDED_TAIL_TEXT = "A one-sided confidence interval puts the entire significance level α into one tail (the shaded rejection region), so you get just one bound at confidence 1−α instead of two. In the left-tailed / lower-bound case, the interval is [L, ∞), meaning “we’re 95% confident the true value is at least L,” which fits questions like “Is a lightbulb’s mean lifetime ≥ 10,000 hours?” In the right-tailed / upper-bound case, the interval is (−∞, U], meaning “we’re 95% confident the true value is no more than U,” which fits questions like “Is average pollution ≤ the safety threshold?” You use a one-tailed CI when only one direction matters (and you’re willing to ignore the other), and it lines up with a one-tailed test: if the spec/null value falls beyond your one-sided bound in the wrong direction, you’d reject at level α.";

    function openInfoModal({ title, img, text }){
      infoTitle.textContent = title;
      infoImg.src = img;
      infoImg.alt = title;
      infoText.textContent = text;
      infoModalBack.style.display = 'flex';
    }

    function closeInfoModal(){
      infoModalBack.style.display = 'none';
      // Clear src so re-open is always clean
      infoImg.src = '';
    }

    if(infoTwoOne){
      infoTwoOne.addEventListener('click', () => {
        openInfoModal({
          title: 'Two-sided vs One-sided',
          img: 'Two One sided.png',
          text: TWO_ONE_SIDED_TEXT
        });
      });
    }

    if(infoTail){
      infoTail.addEventListener('click', () => {
        openInfoModal({
          title: 'Left-tailed vs Right-tailed',
          img: 'One sided CI.png',
          text: ONE_SIDED_TAIL_TEXT
        });
      });
    }

    if(infoClose){ infoClose.addEventListener('click', closeInfoModal); }
    if(infoModalBack){
      infoModalBack.addEventListener('click', (e) => { if(e.target === infoModalBack) closeInfoModal(); });
    }

    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape'){
        if(infoModalBack && infoModalBack.style.display === 'flex') closeInfoModal();
        if(colModalBack && colModalBack.style.display === 'flex') closeColPicker();
      }
    });

    // ---------------------------
    // Inputs config (STRICT separate bars)
    // ---------------------------
    function requiredFields(){
      if(state.mode === 'm1') return ['a','b','c','d'];
      if(state.mode === 'm2') return ['rr','se'];
      if(state.mode === 'm3'){
        if(state.sided === 'two') return ['rr','lcl','ucl'];
        return state.tail === 'left' ? ['rr','lcl'] : ['rr','ucl'];
      }
      return [];
    }

    function fieldMeta(key){
      const meta = {
        a:  { label: 'a list', help: 'Events in exposed (comma-separated).', placeholder: 'e.g., 12, 5, 0' },
        b:  { label: 'b list', help: 'Non-events in exposed (comma-separated).', placeholder: 'e.g., 88, 95, 10' },
        c:  { label: 'c list', help: 'Events in unexposed (comma-separated).', placeholder: 'e.g., 20, 4, 2' },
        d:  { label: 'd list', help: 'Non-events in unexposed (comma-separated).', placeholder: 'e.g., 80, 96, 8' },
        rr: { label: 'RR list', help: 'Relative risk values (must be > 0).', placeholder: 'e.g., 1.2, 0.85, 2.1' },
        se: { label: 'Standard error list', help: 'Standard error of log(RR) (must be > 0).', placeholder: 'e.g., 0.12, 0.31, 0.08' },
        lcl:{ label: 'Lower bound list', help: 'Lower confidence bound (must be > 0).', placeholder: 'e.g., 0.9, 0.6, 1.4' },
        ucl:{ label: 'Upper bound list', help: 'Upper confidence bound (must be > 0).', placeholder: 'e.g., 1.6, 1.2, 3.1' },
      };
      return meta[key];
    }

    function escapeHtml(s){
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    function buildManualInputs(){
      manualInputs.innerHTML = '';
      fieldErrors.textContent = '';

      const keys = requiredFields();
      keys.forEach((k, idx) => {
        const m = fieldMeta(k);
        const div = document.createElement('div');
        div.className = 'min-w-0';
        div.innerHTML = `
          <div class="label" title="${escapeHtml(m.help)}">${escapeHtml(m.label)}</div>
          <input type="text" id="in-${k}" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 list-input" placeholder="${escapeHtml(m.placeholder)}" autocomplete="off" />
          <div class="hint mt-2">${escapeHtml(m.help)}</div>
        `;
        manualInputs.appendChild(div);

        const input = div.querySelector('input');
        input.addEventListener('input', () => validateFields(false));
      });

      // Continuity correction toggle (only relevant in 2×2 mode)
      ccToggleLine.style.display = (state.mode === 'm1') ? 'block' : 'none';

      updateModeBadge();
      updateAssumptions();
      validateFields(false);
    }

    function updateModeBadge(){
      const m = {
        m1: 'Mode: 2×2 table → RR / SE / CI',
        m2: 'Mode: RR + SE → CI',
        m3: 'Mode: RR + CI → SE'
      };
      modeBadge.textContent = m[state.mode] ?? '';
    }

    function updateAssumptions(){
      if(!assumptionList) return;
      const bullets = [];
      bullets.push('Uses a large-sample (Wald) approach on the log scale.');
      bullets.push('Relative risk and confidence bounds must be positive (the log transform requires values > 0).');
      bullets.push('Comma-separated lists are aligned by index; mismatched lengths are processed up to the shortest list and extras are flagged.');

      if(state.sided === 'two'){
        bullets.push('Two-sided intervals split the significance level across both tails.');
      } else {
        bullets.push(`One-sided intervals use a single tail (${state.tail === 'left' ? 'left-tailed / lower bound' : 'right-tailed / upper bound'}).`);
      }

      if(state.mode === 'm1'){
        bullets.push('2×2 counts must be non-negative (integers preferred).');
        bullets.push('Zero cells can break log-scale calculations; consider the continuity correction option when any cell is zero.');
        bullets.push('If a=c=0 or b=d=0, the relative risk or its uncertainty may be undefined or not meaningful for meta-analysis; such rows are flagged.');
      }
      if(state.mode === 'm2'){
        bullets.push('Requires RR > 0 and a positive standard error of log(RR).');
      }
      if(state.mode === 'm3'){
        if(state.sided === 'two'){
          bullets.push('Two-sided back-calculation requires both a lower and upper bound (lower < upper).');
        } else {
          bullets.push(state.tail === 'left'
            ? 'One-sided back-calculation requires a lower bound.'
            : 'One-sided back-calculation requires an upper bound.');
        }
      }

      assumptionList.innerHTML = bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('');

      if(assumeBadge){
        const modeLabel = state.mode === 'm1' ? '2×2 table' : (state.mode === 'm2' ? 'RR + SE' : 'RR + CI');
        const sideLabel = state.sided === 'two'
          ? 'Two-sided'
          : (state.tail === 'left' ? 'One-sided (Left-tailed)' : 'One-sided (Right-tailed)');
        assumeBadge.textContent = `${modeLabel} · ${sideLabel}`;
      }
    }

    // ---------------------------
    // Confidence
    // ---------------------------
    function computeZ(){
      const alpha = 1 - (state.conf/100);
      const p = (state.sided === 'two') ? (1 - alpha/2) : (1 - alpha);
      return normInv(p);
    }

    function syncConfidence(from){
      let v = from === 'range' ? Number(confRange.value) : Number(confNum.value);
      if(!Number.isFinite(v)) v = 95;
      v = clamp(v, 80, 99.9);
      v = Math.round(v*10)/10;
      state.conf = v;
      confRange.value = String(v);
      confNum.value = String(v);
      zPill.textContent = `Z-value: ${fmt(computeZ())}`;
    }

    confRange.addEventListener('input', () => syncConfidence('range'));
    confNum.addEventListener('input', () => syncConfidence('num'));

    // ---------------------------
    // Mode tabs
    // ---------------------------
    function setTab(groupButtons, activeId){
      groupButtons.forEach(btn => btn.setAttribute('aria-selected', btn.id === activeId ? 'true' : 'false'));
    }

    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.mode = btn.dataset.mode;
        setTab([...document.querySelectorAll('[data-mode]')], btn.id);
        buildManualInputs();
        clearResults(true);
      });
    });

    // Interval toggles
    sidedToggle.addEventListener('change', () => {
      state.sided = sidedToggle.checked ? 'one' : 'two';
      tailField.style.display = (state.sided === 'one') ? 'block' : 'none';
      buildManualInputs();
      syncConfidence();
      clearResults(true);
    });

    if(tailToggle){
      tailToggle.addEventListener('change', () => {
        state.tail = tailToggle.checked ? 'right' : 'left';
        buildManualInputs();
        clearResults(true);
      });
    }

    ccToggle.addEventListener('change', () => {
      state.cc = !!ccToggle.checked;
      validateFields(false);
      clearResults(true);
    });

    // ---------------------------
    // Validation
    // ---------------------------
    function getInputValue(key){
      const el = document.getElementById(`in-${key}`);
      return el ? el.value : '';
    }

    function validateFields(showDetails){
      const keys = requiredFields();
      const problems = [];
      const warnings = [];

      keys.forEach(k => {
        const parsed = parseList(getInputValue(k));
        const bad = parsed.filter(x => !x.ok);
        if(bad.length){
          problems.push(`${fieldMeta(k).label}: invalid value(s) → ${bad.slice(0,6).map(x => `'${x.raw}'`).join(', ')}${bad.length>6?'…':''}`);
        }

        const nums = parsed.filter(x => x.ok).map(x => x.val);
        if(k === 'rr'){
          if(nums.some(n => n <= 0)) problems.push(`${fieldMeta(k).label}: values must be > 0`);
        }
        if(k === 'se'){
          if(nums.some(n => n <= 0)) problems.push(`${fieldMeta(k).label}: values must be > 0`);
        }
        if(['a','b','c','d'].includes(k)){
          if(nums.some(n => n < 0)) problems.push(`${fieldMeta(k).label}: counts must be non-negative`);
          if(nums.some(n => Math.abs(n - Math.round(n)) > 1e-12)) warnings.push(`${fieldMeta(k).label}: non-integer counts detected (allowed, but check data).`);
          if(nums.some(n => n === 0)) warnings.push(`${fieldMeta(k).label}: zeros detected (may cause unstable/undefined results).`);
        }
        if(['lcl','ucl'].includes(k)){
          if(nums.some(n => n <= 0)) problems.push(`${fieldMeta(k).label}: bounds must be > 0`);
        }
      });

      if(problems.length){
        fieldErrors.innerHTML = `<span class="dangerText"><strong>Input issues:</strong></span> ${escapeHtml(problems[0])}${problems.length>1?` <span class="note">(+${problems.length-1} more)</span>`:''}`;
      } else if(warnings.length){
        fieldErrors.innerHTML = `<span class="warnText"><strong>Warnings:</strong></span> ${escapeHtml(warnings[0])}${warnings.length>1?` <span class="note">(+${warnings.length-1} more)</span>`:''}`;
      } else {
        fieldErrors.innerHTML = `<span class="okText"><strong>Ready.</strong></span> Enter lists and click Run.`;
      }

      assumptionWarnings.innerHTML = '';
      const extra = [];
      if(state.mode === 'm1') extra.push('Tip: If any 2×2 cell is zero, you can enable the 0.5 continuity correction toggle above.');
      if(warnings.length) extra.push(...warnings);
      if(problems.length && showDetails) extra.push(...problems);
      if(extra.length){
        assumptionWarnings.innerHTML = `<div class="warnText"><strong>Notes:</strong></div><ul class="mt-2 list-disc pl-5">${extra.slice(0,6).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}${extra.length>6?`<li class="note">…and more</li>`:''}</ul>`;
      }

      zPill.textContent = `Z-value: ${fmt(computeZ())}`;
    }

    // ---------------------------
    // Core computations
    // ---------------------------
    function alignRows(fieldKeys){
      const perField = {};
      const lengths = [];
      fieldKeys.forEach(k => {
        const parsed = parseList(getInputValue(k));
        perField[k] = parsed;
        lengths.push(parsed.length);
      });
      const minLen = Math.min(...lengths, Infinity);
      const maxLen = Math.max(...lengths, 0);

      const extras = fieldKeys
        .filter(k => perField[k].length > minLen)
        .map(k => ({ key:k, extra: perField[k].length - minLen }));

      const rows = [];
      for(let i=0;i<minLen;i++){
        const r = { i, values:{}, raw:{}, ok:true, notes:[] };
        fieldKeys.forEach(k => {
          const t = perField[k][i];
          r.raw[k] = t?.raw ?? '';
          r.values[k] = t?.val;
          if(!t || !t.ok) r.ok = false;
        });
        rows.push(r);
      }
      return { rows, minLen, maxLen, extras };
    }

    function computeRow(row){
      const z = computeZ();
      const sided = state.sided;
      const tail = state.tail;

      let out = {};
      let status = 'ok';
      let message = 'OK';

      if(!row.ok){
        return { status:'err', message:'Invalid or missing numeric input in one or more required fields.', out:null, notes: row.notes };
      }

      try{
        if(state.mode === 'm1'){
          let {a,b,c,d} = row.values;
          if([a,b,c,d].some(x => x < 0)) throw new Error('Counts must be non-negative.');

          if(a===0 && c===0){
            status = 'warn';
            row.notes.push('a=c=0 (no events in either group): RR/uncertainty may be undefined or not meaningful for meta-analysis.');
          }
          if(b===0 && d===0){
            status = 'warn';
            row.notes.push('b=d=0 (no non-events in either group): RR/uncertainty may be undefined or not meaningful for meta-analysis.');
          }

          const anyZero = [a,b,c,d].some(x => x === 0);
          if(anyZero){
            if(state.cc){
              a += 0.5; b += 0.5; c += 0.5; d += 0.5;
              row.notes.push('Applied 0.5 continuity correction (zero cell detected).');
              status = (status === 'ok') ? 'warn' : status;
            } else {
              row.notes.push('Zero cell detected (consider continuity correction).');
              status = (status === 'ok') ? 'warn' : status;
            }
          }

          const n1 = a + b;
          const n0 = c + d;
          if(!(n1>0 && n0>0)) throw new Error('At least one group total is zero (a+b or c+d).');

          const r1 = a / n1;
          const r0 = c / n0;
          if(!(r1>0 && r0>0)) throw new Error('Risk is zero in at least one group; log-scale calculations may be undefined.');

          const rr = r1 / r0;
          if(!(rr>0)) throw new Error('RR must be positive.');

          const logrr = Math.log(rr);
          const se = Math.sqrt((1/a) + (1/c) - (1/n1) - (1/n0));
          if(!isFinite(se) || !(se>0)) throw new Error('Standard error could not be computed (check zeros and totals).');

          let lcl, ucl;
          if(sided === 'two'){
            lcl = Math.exp(logrr - z*se);
            ucl = Math.exp(logrr + z*se);
          } else {
            if(tail === 'left'){
              lcl = Math.exp(logrr - z*se);
              ucl = Infinity;
            } else {
              lcl = 0;
              ucl = Math.exp(logrr + z*se);
            }
          }

          out = { a: row.values.a, b: row.values.b, c: row.values.c, d: row.values.d, rr, se, lcl, ucl };
          message = (status === 'warn') ? 'Computed with warnings.' : 'Computed.';
          return { status, message, out, notes: row.notes };
        }

        if(state.mode === 'm2'){
          const rr = row.values.rr;
          const se = row.values.se;
          if(!(rr>0)) throw new Error('RR must be > 0.');
          if(!(se>0)) throw new Error('Standard error must be > 0.');

          const logrr = Math.log(rr);
          let lcl, ucl;
          if(sided === 'two'){
            lcl = Math.exp(logrr - z*se);
            ucl = Math.exp(logrr + z*se);
          } else {
            if(tail === 'left'){
              lcl = Math.exp(logrr - z*se);
              ucl = Infinity;
            } else {
              lcl = 0;
              ucl = Math.exp(logrr + z*se);
            }
          }
          out = { rr, se, lcl, ucl };
          return { status:'ok', message:'Computed.', out, notes: row.notes };
        }

        if(state.mode === 'm3'){
          const rr = row.values.rr;
          if(!(rr>0)) throw new Error('RR must be > 0.');

          let se;
          if(sided === 'two'){
            const l = row.values.lcl;
            const u = row.values.ucl;
            if(!(l>0 && u>0)) throw new Error('Bounds must be > 0.');
            if(!(l < u)) throw new Error('Lower bound must be less than upper bound.');
            se = (Math.log(u) - Math.log(l)) / (2*z);
          } else {
            if(tail === 'left'){
              const l = row.values.lcl;
              if(!(l>0)) throw new Error('Lower bound must be > 0.');
              se = (Math.log(rr) - Math.log(l)) / z;
            } else {
              const u = row.values.ucl;
              if(!(u>0)) throw new Error('Upper bound must be > 0.');
              se = (Math.log(u) - Math.log(rr)) / z;
            }
          }

          if(!isFinite(se) || !(se>0)) throw new Error('Standard error must be > 0 (check inputs).');
          out = { rr, lcl: row.values.lcl, ucl: row.values.ucl, se };
          return { status:'ok', message:'Computed.', out, notes: row.notes };
        }

        throw new Error('Unknown mode.');
      } catch(e){
        return { status:'err', message:String(e.message || e), out:null, notes: row.notes };
      }
    }

    // ---------------------------
    // Column picker
    // ---------------------------
    const colMapState = { selections: {} };

    function openColumnPicker(){
      if(!state.parsedFile) return;
      const { rows, headerGuess, filename } = state.parsedFile;
      hasHeader.checked = headerGuess;

      const maxCols = Math.max(...rows.map(r => r.length));
      const headerRow = rows[0] ?? [];
      const defaultNames = Array.from({length:maxCols}, (_,i) => `Column ${String.fromCharCode(65+i)}`);

      function colName(i){
        if(hasHeader.checked){
          const h = String(headerRow[i] ?? '').trim();
          return h ? h : defaultNames[i];
        }
        return defaultNames[i];
      }

      const keys = requiredFields();
      colSelectors.innerHTML = '';
      colMapState.selections = {};

      filePreviewMeta.textContent = `${filename} · ${rows.length} rows · up to ${maxCols} columns`;

      keys.forEach((k, idx) => {
        const m = fieldMeta(k);
        const div = document.createElement('div');
        div.className = 'min-w-0';
        div.innerHTML = `
          <div class="label">${escapeHtml(m.label)}</div>
          <select id="sel-${k}" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"></select>
          <div class="hint mt-2">Choose the column for ${escapeHtml(m.help)}</div>
        `;
        colSelectors.appendChild(div);

        const sel = div.querySelector('select');
        sel.innerHTML = defaultNames.map((_,i) => `<option value="${i}">${escapeHtml(colName(i))}</option>`).join('');
        sel.value = String(Math.min(idx, maxCols-1));
        colMapState.selections[k] = Number(sel.value);
        sel.addEventListener('change', () => {
          colMapState.selections[k] = Number(sel.value);
          updateColPreview();
        });
      });

      
      updateColPreview();
      colModalBack.style.display = 'flex';
    }

    function updateColPreview(){
      if(!state.parsedFile) return;
      const { rows } = state.parsedFile;
      const start = hasHeader.checked ? 1 : 0;
      const keys = requiredFields();
      const previewN = Math.min(5, rows.length - start);
      const lines = [];
      for(let i=0;i<previewN;i++){
        const r = rows[start + i] || [];
        const parts = keys.map(k => {
          const idx = colMapState.selections[k];
          const v = r[idx] ?? '';
          return `${fieldMeta(k).label}: ${String(v).trim()}`;
        });
        lines.push(`Row ${i+1}: ${parts.join(' · ')}`);
      }
      colPreview.textContent = lines.length ? `Preview: ${lines.join(' | ')}` : 'Preview unavailable.';
    }

    function closeColPicker(){ colModalBack.style.display = 'none'; }

    colClose.addEventListener('click', closeColPicker);
    colCancel.addEventListener('click', closeColPicker);
    colModalBack.addEventListener('click', (e) => { if(e.target === colModalBack) closeColPicker(); });

    applyCols.addEventListener('click', () => {
      if(!state.parsedFile) return;
      const { rows } = state.parsedFile;
      const start = hasHeader.checked ? 1 : 0;
      const keys = requiredFields();

      const cols = {};
      keys.forEach(k => cols[k] = []);

      for(let i=start;i<rows.length;i++){
        const r = rows[i] || [];
        keys.forEach(k => {
          const idx = colMapState.selections[k];
          cols[k].push(String(r[idx] ?? '').trim());
        });
      }

      keys.forEach(k => {
        const el = document.getElementById(`in-${k}`);
        if(el) el.value = cols[k].join(', ');
      });

      closeColPicker();
      validateFields(false);
      clearResults(true);
    });

    // ---------------------------
    // Init
    // ---------------------------
    function init(){
      // defaults
      sidedToggle.checked = false; // two-sided
      if(tailToggle) tailToggle.checked = false; // left
      tailField.style.display = 'none';
      ccToggle.checked = false;
      state.cc = false;

      syncConfidence();
      buildManualInputs();
      updateAssumptions();
      zPill.textContent = `Z-value: ${fmt(computeZ())}`;
    }
    init();

    // ---------------------------
    // Results + upload wiring (keeps functionality stable)
    // ---------------------------
    if(!window.__RR_TOOL_BOUND__){
      window.__RR_TOOL_BOUND__ = true;

      clearResults = function(keepLengthNote){
        state.results = [];
        state.lastCsv = '';
        rowPill.textContent = '0 rows';
        zPill.textContent = `Z-value: ${fmt(computeZ())}`;
        copyBtn.disabled = true;
        dlBtn.disabled = true;
        if(!keepLengthNote) lengthNote.textContent = '';
        resultsTable.innerHTML = '<thead><tr><th>Status</th><th>Message</th></tr></thead><tbody><tr><td colspan="2" class="text-slate-500">Run the calculator to see results.</td></tr></tbody>';
      }

      function tableColumns(){
        const cols = [{ key:'idx', label:'#' }, { key:'status', label:'Status' }, { key:'message', label:'Message' }];
        if(state.mode === 'm1'){
          cols.push({key:'a', label:'a'}, {key:'b', label:'b'}, {key:'c', label:'c'}, {key:'d', label:'d'});
          cols.push({key:'rr', label:'RR'}, {key:'se', label:'Standard error of log(RR)'}, {key:'lcl', label:'Lower bound'}, {key:'ucl', label:'Upper bound'});
        } else if(state.mode === 'm2'){
          cols.push({key:'rr', label:'RR'}, {key:'se', label:'Standard error of log(RR)'});
          cols.push({key:'lcl', label:'Lower bound'}, {key:'ucl', label:'Upper bound'});
        } else if(state.mode === 'm3'){
          cols.push({key:'rr', label:'RR'});
          if(state.sided === 'two'){
            cols.push({key:'lcl', label:'Lower bound'}, {key:'ucl', label:'Upper bound'});
          } else {
            cols.push({key: state.tail === 'left' ? 'lcl' : 'ucl', label: state.tail === 'left' ? 'Lower bound' : 'Upper bound'});
          }
          cols.push({key:'se', label:'Standard error of log(RR)'});
        }
        return cols;
      }

      function asCsvValue(v){
        if(v === Infinity) return 'Infinity';
        if(v === -Infinity) return '-Infinity';
        if(v === null || v === undefined) return '';
        if(typeof v === 'number' && !Number.isFinite(v)) return '';
        return String(v);
      }

      function buildCsv(cols, rows){
        const header = cols.map(c => c.label).join(',');
        const lines = rows.map(r => cols.map(c => {
          const val = r[c.key];
          const s = asCsvValue(val);
          const needsQuote = /[\n\r,"]/.test(s);
          const esc = s.replace(/"/g, '""');
          return needsQuote ? `"${esc}"` : esc;
        }).join(','));
        return [header, ...lines].join('\n');
      }

      function renderResults(){
        const cols = tableColumns();
        const thead = `<thead><tr>${cols.map(c => `<th>${escapeHtml(c.label)}</th>`).join('')}</tr></thead>`;
        const tbodyRows = (state.results.length ? state.results : []).map(r => {
          return `<tr>${cols.map(c => {
            if(c.key === 'status') return `<td>${icon(r.status)}</td>`;
            if(c.key === 'idx') return `<td>${escapeHtml(String(r.idx))}</td>`;
            if(c.key === 'message'){
              const notes = (r.notes && r.notes.length) ? ` <span class="note">(${escapeHtml(r.notes[0])}${r.notes.length>1?'…':''})</span>` : '';
              return `<td>${escapeHtml(r.message)}${notes}</td>`;
            }
            const v = r[c.key];
            return `<td>${escapeHtml(fmt(typeof v === 'number' ? v : v))}</td>`;
          }).join('')}</tr>`;
        }).join('');

        const empty = `<tbody><tr><td colspan="${cols.length}" class="text-slate-500">Run the calculator to see results.</td></tr></tbody>`;
        resultsTable.innerHTML = thead + `<tbody>${tbodyRows || empty.replace(/^<tbody>|<\/tbody>$/g,'')}</tbody>`;

        state.lastCsv = buildCsv(cols, state.results.map(r => {
          const out = { ...r };
          // Ensure numeric fields export as plain numbers/Infinity
          return out;
        }));

        copyBtn.disabled = !state.results.length;
        dlBtn.disabled = !state.results.length;
        rowPill.textContent = `${state.results.length} row${state.results.length===1?'':'s'}`;
      }

      runBtn.addEventListener('click', () => {
        validateFields(true);
        const keys = requiredFields();
        const { rows, extras, minLen, maxLen } = alignRows(keys);

        if(!rows.length){
          clearResults(false);
          lengthNote.textContent = (maxLen > 0) ? 'No complete rows found. Check inputs for missing/invalid values.' : '';
          return;
        }

        // Length mismatch note
        if(extras.length){
          const msg = extras.map(e => `${fieldMeta(e.key).label}: ${e.extra} extra item(s) ignored`).join(' · ');
          lengthNote.textContent = msg;
        } else {
          lengthNote.textContent = '';
        }

        const computed = rows.map(r => {
          const res = computeRow(r);
          const base = {
            idx: r.i + 1,
            status: res.status,
            message: res.message,
            notes: res.notes || []
          };
          const out = res.out || {};
          return { ...base, ...out };
        });

        state.results = computed;
        renderResults();
      });

      copyBtn.addEventListener('click', async () => {
        try{
          await navigator.clipboard.writeText(state.lastCsv || '');
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy to Clipboard'), 1100);
        } catch {
          copyBtn.textContent = 'Copy failed';
          setTimeout(() => (copyBtn.textContent = 'Copy to Clipboard'), 1100);
        }
      });

      dlBtn.addEventListener('click', () => {
        const blob = new Blob([state.lastCsv || ''], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rr_ci_logse_results.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });

      resetBtn.addEventListener('click', () => {
        // Reset state
        state.mode = 'm1';
        state.sided = 'two';
        state.tail = 'left';
        state.conf = 95;
        state.cc = false;
        state.parsedFile = null;

        // Reset UI controls
        document.getElementById('tab-m1').click();
        sidedToggle.checked = false;
        tailToggle.checked = false;
        tailField.style.display = 'none';
        confRange.value = '95';
        confNum.value = '95';
        ccToggle.checked = false;

        // Clear manual inputs
        requiredFields().forEach(k => {
          const el = document.getElementById(`in-${k}`);
          if(el) el.value = '';
        });

        // File
        fileStatus.textContent = 'No file loaded.';
        fileInput.value = '';

        // Close modals
        colModalBack.style.display = 'none';
        infoModalBack.style.display = 'none';

        syncConfidence();
        updateAssumptions();
        validateFields(false);
        clearResults(false);
      });

      // ---------------------------
      // File upload parsing
      // ---------------------------
      function detectDelimiter(line){
        const comma = (line.match(/,/g) || []).length;
        const tab = (line.match(/\t/g) || []).length;
        const semi = (line.match(/;/g) || []).length;
        if(tab >= comma && tab >= semi) return '\t';
        if(semi > comma) return ';';
        return ',';
      }

      function parseDelimited(text){
        const normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalized.split('\n').filter(l => l.trim() !== '');
        if(!lines.length) return [];
        const delim = detectDelimiter(lines[0]);

        function parseLine(line){
          // Lightweight CSV/TSV parser with quotes
          const out = [];
          let cur = '';
          let inQ = false;
          for(let i=0;i<line.length;i++){
            const ch = line[i];
            if(ch === '"'){
              if(inQ && line[i+1] === '"'){ cur += '"'; i++; }
              else inQ = !inQ;
            } else if(!inQ && ch === delim){
              out.push(cur);
              cur = '';
            } else {
              cur += ch;
            }
          }
          out.push(cur);
          return out.map(x => String(x ?? '').trim());
        }

        return lines.map(parseLine);
      }

      async function parseXlsx(file){
        if(!window.XLSX) throw new Error('XLSX parser not available.');
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type:'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, raw:false, defval:'' });
        return rows.map(r => (r || []).map(x => String(x ?? '').trim()));
      }

      async function handleFile(file){
        if(!file) return;
        // Clear so selecting the same file again triggers change
        fileInput.value = '';

        fileStatus.textContent = `Loading: ${file.name}`;
        const name = file.name.toLowerCase();
        try{
          let rows = [];
          if(name.endsWith('.xlsx')){
            rows = await parseXlsx(file);
          } else {
            const text = await file.text();
            rows = parseDelimited(text);
          }

          if(!rows.length) throw new Error('No data found in file.');

          state.parsedFile = {
            filename: file.name,
            rows,
            headerGuess: true
          };

          fileStatus.textContent = `Loaded: ${file.name} (${rows.length} row${rows.length===1?'':'s'})`;
          openColumnPicker();
        } catch(e){
          state.parsedFile = null;
          fileStatus.textContent = `Could not load file: ${String(e.message || e)}`;
        } finally {
          fileInput.value = '';
        }
      }

      // Browse
      browseBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if(f) handleFile(f);
      });

      // Drag & drop
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if(f) handleFile(f);
      });
      dropZone.addEventListener('click', (e) => {
        // Click zone opens picker (still keep Browse button)
        if(e.target && (e.target.id === 'browseBtn')) return;
        fileInput.value = '';
        fileInput.click();
      });

      // Initialize table state
      clearResults(false);
    }
  
