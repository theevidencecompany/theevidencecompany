    // ---------------------------
    // Utilities (internal math; no formula display)
    // ---------------------------

    // Inverse standard normal CDF (Acklam approximation)
    // Allowed by spec (alternative to a lookup table)
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

    function escapeHtml(s){
      return String(s).replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
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
    // Inputs config (STRICT separate bars)
    // ---------------------------
    function requiredFields(){
      if(state.mode === 'm1') return ['a','b','c','d'];
      if(state.mode === 'm2') return ['or','se'];
      if(state.mode === 'm3'){
        if(state.sided === 'two') return ['or','lcl','ucl'];
        return state.tail === 'left' ? ['or','lcl'] : ['or','ucl'];
      }
      return [];
    }

    function fieldMeta(key){
      const meta = {
        a:  { label: 'a list', help: 'Events in exposed (comma-separated).', placeholder: 'e.g., 12, 5, 0' },
        b:  { label: 'b list', help: 'Non-events in exposed (comma-separated).', placeholder: 'e.g., 88, 95, 10' },
        c:  { label: 'c list', help: 'Events in unexposed (comma-separated).', placeholder: 'e.g., 20, 4, 2' },
        d:  { label: 'd list', help: 'Non-events in unexposed (comma-separated).', placeholder: 'e.g., 80, 96, 8' },
        or: { label: 'OR list', help: 'Odds ratio values (must be > 0).', placeholder: 'e.g., 1.2, 0.85, 2.1' },
        se: { label: 'Standard error list', help: 'Standard error of log(OR) (must be > 0).', placeholder: 'e.g., 0.12, 0.31, 0.08' },
        lcl:{ label: 'Lower bound list', help: 'Lower confidence bound (must be > 0).', placeholder: 'e.g., 0.9, 0.6, 1.4' },
        ucl:{ label: 'Upper bound list', help: 'Upper confidence bound (must be > 0).', placeholder: 'e.g., 1.6, 1.2, 3.1' },
      };
      return meta[key];
    }

    function buildManualInputs(){
      manualInputs.innerHTML = '';
      fieldErrors.textContent = '';

      const keys = requiredFields();
      keys.forEach((k) => {
        const m = fieldMeta(k);
        const div = document.createElement('div');
        div.className = 'w-full';
        div.innerHTML = `
          <div class="label" title="${escapeHtml(m.help)}">${escapeHtml(m.label)}</div>
          <input type="text" id="in-${k}" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 list-input" placeholder="${escapeHtml(m.placeholder)}" autocomplete="off" />
          <div class="hint mt-2">${escapeHtml(m.help)}</div>
        `;
        manualInputs.appendChild(div);

        const input = div.querySelector('input');
        input.addEventListener('input', () => validateFields(false));
      });

      // Continuity correction toggle only for 2×2 mode
      ccToggleLine.style.display = (state.mode === 'm1') ? 'block' : 'none';

      updateModeBadge();
      updateAssumptions();
      validateFields(false);
    }

    function updateModeBadge(){
      const m = {
        m1: 'Mode: 2×2 table → OR / SE / CI',
        m2: 'Mode: OR + SE → CI',
        m3: 'Mode: OR + CI → SE'
      };
      modeBadge.textContent = m[state.mode] ?? '';
    }

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

    function updateAssumptions(){
      const bullets = [];
      bullets.push('Uses a large-sample (Wald) approach on the log scale.');
      bullets.push('Odds ratio and confidence bounds must be positive (the log transform requires values > 0).');
      bullets.push('Comma-separated lists are aligned by index; mismatched lengths are processed up to the shortest list and extras are flagged.');

      if(state.sided === 'two'){
        bullets.push('Two-sided intervals split the significance level across both tails.');
      } else {
        bullets.push(`One-sided intervals use a single tail (${state.tail === 'left' ? 'left-tailed / lower bound' : 'right-tailed / upper bound'}).`);
      }

      if(state.mode === 'm1'){
        bullets.push('2×2 counts must be non-negative (integers preferred).');
        bullets.push('Zero cells can break log-scale calculations; consider the continuity correction option when any cell is zero.');
        bullets.push('If continuity correction is off and any cell is zero, affected rows are marked as “Cannot compute.”');
      }
      if(state.mode === 'm2'){
        bullets.push('Requires OR > 0 and a positive standard error of log(OR).');
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

      const modeLabel = state.mode === 'm1' ? '2×2 table' : (state.mode === 'm2' ? 'OR + SE' : 'OR + CI');
      const sideLabel = state.sided === 'two'
        ? 'Two-sided'
        : (state.tail === 'left' ? 'One-sided (Left-tailed)' : 'One-sided (Right-tailed)');
      assumeBadge.textContent = `${modeLabel} · ${sideLabel}`;
    }

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

    tailToggle.addEventListener('change', () => {
      state.tail = tailToggle.checked ? 'right' : 'left';
      buildManualInputs();
      clearResults(true);
    });

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
        if(k === 'or'){
          if(nums.some(n => n <= 0)) problems.push(`${fieldMeta(k).label}: values must be > 0`);
        }
        if(k === 'se'){
          if(nums.some(n => n <= 0)) problems.push(`${fieldMeta(k).label}: values must be > 0`);
        }
        if(['a','b','c','d'].includes(k)){
          if(nums.some(n => n < 0)) problems.push(`${fieldMeta(k).label}: counts must be non-negative`);
          if(nums.some(n => Math.abs(n - Math.round(n)) > 1e-12)) warnings.push(`${fieldMeta(k).label}: non-integer counts detected (allowed, but check data).`);
          if(nums.some(n => n === 0)) warnings.push(`${fieldMeta(k).label}: zeros detected (may cause undefined log-scale results).`);
        }
        if(['lcl','ucl'].includes(k)){
          if(nums.some(n => n <= 0)) problems.push(`${fieldMeta(k).label}: bounds must be > 0`);
        }
      });

      if(problems.length){
        fieldErrors.innerHTML = `<span class="dangerText"><strong>Input issues:</strong></span> ${escapeHtml(problems[0])}${problems.length>1?` <span class="hint">(+${problems.length-1} more)</span>`:''}`;
      } else if(warnings.length){
        fieldErrors.innerHTML = `<span class="warnText"><strong>Warnings:</strong></span> ${escapeHtml(warnings[0])}${warnings.length>1?` <span class="hint">(+${warnings.length-1} more)</span>`:''}`;
      } else {
        fieldErrors.innerHTML = `<span class="okText"><strong>Ready.</strong></span> Enter lists and click Run.`;
      }

      assumptionWarnings.innerHTML = '';
      const extra = [];
      if(state.mode === 'm1') extra.push('Tip: If any 2×2 cell is zero, you can enable the 0.5 continuity correction toggle above.');
      if(warnings.length) extra.push(...warnings);
      if(problems.length && showDetails) extra.push(...problems);
      if(extra.length){
        assumptionWarnings.innerHTML = `<div class="warnText"><strong>Notes:</strong></div><ul class="mt-2 list-disc pl-5">${extra.slice(0,6).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}${extra.length>6?`<li class="hint">…and more</li>`:''}</ul>`;
      }

      zPill.textContent = `Z-value: ${fmt(computeZ())}`;
    }

    // ---------------------------
    // Row alignment
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

    // ---------------------------
    // Core computations
    // ---------------------------
    function computeRow(row){
      const z = computeZ();
      const sided = state.sided;
      const tail = state.tail;

      if(!row.ok){
        return { status:'err', message:'Invalid or missing numeric input in one or more required fields.', out:null, notes: row.notes };
      }

      try{
        // Mode 1: 2×2 → OR/SE/CI
        if(state.mode === 'm1'){
          let {a,b,c,d} = row.values;
          if([a,b,c,d].some(x => x < 0)) return { status:'err', message:'Counts must be non-negative.', out:null, notes: row.notes };

          const anyZero = [a,b,c,d].some(x => x === 0);
          if(anyZero){
            if(state.cc){
              a += 0.5; b += 0.5; c += 0.5; d += 0.5;
              row.notes.push('Applied 0.5 continuity correction (zero cell detected).');
            } else {
              // Spec: if correction is off and any required denominator becomes zero, cannot compute
              return { status:'err', message:'Cannot compute: at least one 2×2 cell is zero. Enable the continuity correction to proceed.', out:null, notes: ['Zero cell detected.'] };
            }
          }

          // After correction (or if no zeros), require strictly positive cells for log-scale quantities
          if([a,b,c,d].some(x => !(x > 0))) return { status:'err', message:'Cannot compute: 2×2 cells must be > 0 for log-scale OR and standard error.', out:null, notes: row.notes };

          const orv = (a*d)/(b*c);
          if(!(orv > 0) || !isFinite(orv)) return { status:'err', message:'Cannot compute: odds ratio must be finite and > 0 (check inputs).', out:null, notes: row.notes };

          const logor = Math.log(orv);
          const se = Math.sqrt((1/a) + (1/b) + (1/c) + (1/d));
          if(!isFinite(se) || !(se > 0)) return { status:'err', message:'Cannot compute: standard error could not be computed (check zeros).', out:null, notes: row.notes };

          let lcl, ucl;
          if(sided === 'two'){
            lcl = Math.exp(logor - z*se);
            ucl = Math.exp(logor + z*se);
          } else {
            if(tail === 'left'){
              lcl = Math.exp(logor - z*se);
              ucl = Infinity;
            } else {
              lcl = 0;
              ucl = Math.exp(logor + z*se);
            }
          }

          const status = anyZero ? 'warn' : 'ok';
          const message = anyZero ? 'Computed with continuity correction.' : 'Computed.';
          return { status, message, out: { a: row.values.a, b: row.values.b, c: row.values.c, d: row.values.d, or: orv, se, lcl, ucl }, notes: row.notes };
        }

        // Mode 2: OR + SE → CI
        if(state.mode === 'm2'){
          const orv = row.values.or;
          const se = row.values.se;
          if(!(orv > 0)) return { status:'err', message:'OR must be > 0.', out:null, notes: row.notes };
          if(!(se > 0)) return { status:'err', message:'Standard error must be > 0.', out:null, notes: row.notes };

          const logor = Math.log(orv);
          let lcl, ucl;
          if(sided === 'two'){
            lcl = Math.exp(logor - z*se);
            ucl = Math.exp(logor + z*se);
          } else {
            if(tail === 'left'){
              lcl = Math.exp(logor - z*se);
              ucl = Infinity;
            } else {
              lcl = 0;
              ucl = Math.exp(logor + z*se);
            }
          }
          return { status:'ok', message:'Computed.', out: { or: orv, se, lcl, ucl }, notes: row.notes };
        }

        // Mode 3: OR + CI → SE
        if(state.mode === 'm3'){
          const orv = row.values.or;
          if(!(orv > 0)) return { status:'err', message:'OR must be > 0.', out:null, notes: row.notes };

          let se;
          if(state.sided === 'two'){
            const l = row.values.lcl;
            const u = row.values.ucl;
            if(!(l > 0 && u > 0)) return { status:'err', message:'Bounds must be > 0.', out:null, notes: row.notes };
            if(!(l < u)) return { status:'err', message:'Lower bound must be less than upper bound.', out:null, notes: row.notes };
            se = (Math.log(u) - Math.log(l)) / (2*z);
          } else {
            if(state.tail === 'left'){
              const l = row.values.lcl;
              if(!(l > 0)) return { status:'err', message:'Lower bound must be > 0.', out:null, notes: row.notes };
              se = (Math.log(orv) - Math.log(l)) / z;
            } else {
              const u = row.values.ucl;
              if(!(u > 0)) return { status:'err', message:'Upper bound must be > 0.', out:null, notes: row.notes };
              se = (Math.log(u) - Math.log(orv)) / z;
            }
          }

          if(!isFinite(se) || !(se > 0)) return { status:'err', message:'Standard error must be > 0 (check inputs).', out:null, notes: row.notes };
          return { status:'ok', message:'Computed.', out: { or: orv, lcl: row.values.lcl, ucl: row.values.ucl, se }, notes: row.notes };
        }

        return { status:'err', message:'Unknown mode.', out:null, notes: row.notes };
      } catch(e){
        return { status:'err', message: String(e.message || e), out:null, notes: row.notes };
      }
    }

    function buildColumns(){
      if(state.mode === 'm1'){
        return {
          cols: ['Status','Message','a','b','c','d','OR','Standard error of log(OR)','Lower bound','Upper bound'],
          keys:  ['status','message','a','b','c','d','or','se','lcl','ucl']
        };
      }
      if(state.mode === 'm2'){
        return {
          cols: ['Status','Message','OR','Standard error of log(OR)','Lower bound','Upper bound'],
          keys: ['status','message','or','se','lcl','ucl']
        };
      }
      if(state.sided === 'two'){
        return {
          cols: ['Status','Message','OR','Lower bound','Upper bound','Standard error of log(OR)'],
          keys: ['status','message','or','lcl','ucl','se']
        };
      }
      if(state.tail === 'left'){
        return {
          cols: ['Status','Message','OR','Lower bound','Standard error of log(OR)'],
          keys: ['status','message','or','lcl','se']
        };
      }
      return {
        cols: ['Status','Message','OR','Upper bound','Standard error of log(OR)'],
        keys: ['status','message','or','ucl','se']
      };
    }

    function renderResults(rowsAligned, computedRows){
      const { cols, keys } = buildColumns();
      const thead = `<thead><tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>`;

      let tbody = '<tbody>';
      if(computedRows.length === 0){
        tbody += `<tr><td colspan="${cols.length}" class="text-slate-500">No rows to display.</td></tr>`;
      } else {
        computedRows.forEach((r) => {
          const st = r.status;
          const msg = r.message + (r.notes?.length ? ` (${r.notes[0]}${r.notes.length>1?'…':''})` : '');

          const record = { status: st, message: msg };
          if(r.out){
            Object.assign(record, r.out);
          } else {
            Object.assign(record, rowsAligned[r._rowIndex]?.values ?? {});
          }

          const cells = keys.map(k => {
            if(k === 'status'){
              return `<td><div style="display:flex; align-items:center; gap:8px">${icon(st)}<small style="color:#64748b; font-variant-numeric:tabular-nums">${escapeHtml(st.toUpperCase())}</small></div></td>`;
            }
            if(k === 'message'){
              const cls = st==='err' ? 'dangerText' : (st==='warn' ? 'warnText' : 'okText');
              return `<td class="${cls}">${escapeHtml(record.message ?? '')}</td>`;
            }
            const v = record[k];
            return `<td style="font-variant-numeric:tabular-nums">${escapeHtml(fmt(v))}</td>`;
          });

          tbody += `<tr>${cells.join('')}</tr>`;
        });
      }
      tbody += '</tbody>';

      resultsTable.innerHTML = thead + tbody;

      // CSV for copy/download
      const csvRows = [];
      csvRows.push(cols.join(','));
      computedRows.forEach(r => {
        const st = r.status;
        const msg = r.message + (r.notes?.length ? ` (${r.notes.join(' | ')})` : '');
        const rec = { status: st, message: msg };
        if(r.out) Object.assign(rec, r.out);

        const row = keys.map(k => {
          if(k === 'status') return st;
          if(k === 'message') return msg;
          return fmt(rec[k]);
        }).map(x => {
          const s = String(x ?? '');
          return /[\n\r,\"]/g.test(s) ? '"' + s.replace(/\"/g,'""') + '"' : s;
        });
        csvRows.push(row.join(','));
      });
      state.lastCsv = csvRows.join('\n');

      copyBtn.disabled = computedRows.length === 0;
      dlBtn.disabled = computedRows.length === 0;
    }

    function clearResults(soft){
      state.results = [];
      rowPill.textContent = '0 rows';
      lengthNote.textContent = '';
      copyBtn.disabled = true;
      dlBtn.disabled = true;
      if(!soft){
        resultsTable.innerHTML = `<thead><tr><th>Status</th><th>Message</th></tr></thead><tbody><tr><td colspan="2" class="text-slate-500">Run the calculator to see results.</td></tr></tbody>`;
      }
    }

    // ---------------------------
    // Run
    // ---------------------------
    runBtn.addEventListener('click', () => {
      validateFields(true);
      syncConfidence();

      const keys = requiredFields();
      const aligned = alignRows(keys);
      const { rows, minLen, maxLen, extras } = aligned;

      rowPill.textContent = `${minLen} row${minLen===1?'':'s'}`;

      const extraMsg = [];
      extras.forEach(e => extraMsg.push(`${fieldMeta(e.key).label}: ${e.extra} extra value(s) ignored`));
      if(maxLen !== minLen){
        lengthNote.innerHTML = `<span class="warnText"><strong>Length mismatch:</strong></span> Processed up to the shortest list (${minLen}). ${extraMsg.length ? escapeHtml(extraMsg.join(' · ')) : ''}`;
      } else {
        lengthNote.textContent = '';
      }

      const computed = rows.map((row, idx) => {
        const c = computeRow(row);
        c._rowIndex = idx;
        return c;
      });

      const alignedRows = rows.map(r => ({ values: r.values }));
      renderResults(alignedRows, computed);
      state.results = computed;

      // Loud warning if mode 1 + zeros (even if computed with correction)
      if(state.mode === 'm1'){
        const errZero = computed.filter(r => (r.message||'').toLowerCase().includes('cannot compute') && (r.notes||[]).some(n => n.toLowerCase().includes('zero'))).length;
        const usedCC = computed.filter(r => (r.notes||[]).some(n => n.toLowerCase().includes('continuity correction'))).length;
        const anyZeroFlag = errZero || usedCC;
        if(anyZeroFlag){
          const bits = [];
          if(usedCC) bits.push(`${usedCC} row(s) used continuity correction due to zero cells.`);
          if(errZero) bits.push(`${errZero} row(s) could not be computed because zero cells were present and continuity correction was off.`);
          assumptionWarnings.innerHTML = `<div class="warnText"><strong>Notes:</strong></div><ul class="mt-2 list-disc pl-5">${bits.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
        }
      }
    });

    copyBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(state.lastCsv || '');
        const old = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = old), 1200);
      } catch {
        alert('Clipboard copy failed in this browser. You can still use Download CSV.');
      }
    });

    dlBtn.addEventListener('click', () => {
      const blob = new Blob([state.lastCsv || ''], {type:'text/csv;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'entropy_or_ci_se_results.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    resetBtn.addEventListener('click', () => {
      state.mode = 'm1';
      state.sided = 'two';
      state.tail = 'left';
      state.conf = 95;
      state.cc = false;

      setTab([...document.querySelectorAll('[data-mode]')], 'tab-m1');

      sidedToggle.checked = false;
      tailToggle.checked = false;
      tailField.style.display = 'none';

      confRange.value = '95';
      confNum.value = '95';

      ccToggle.checked = false;

      state.parsedFile = null;
      fileStatus.textContent = 'No file loaded.';

      buildManualInputs();
      syncConfidence();
      updateAssumptions();

      clearResults(false);
      validateFields(false);
    });

    // ---------------------------
    // Info modals (EXACT image names + EXACT text)
    // ---------------------------
    function openInfo(which){
      if(which === 'twoone'){
        infoTitle.textContent = 'Two-sided vs One-sided';
        infoImg.src = 'Two One sided.png';
        infoText.textContent = 'Choosing the right interval depends on whether you need to account for deviations in both directions or just one. A two-sided interval is used when any change is relevant, like testing if a new medication changes blood pressure either higher or lower than the current standard. A one-sided interval is used when you only care about a specific directional benefit, such as verifying that a new car battery lasts longer than the previous model.';
      } else {
        infoTitle.textContent = 'Left-tailed vs Right-tailed';
        infoImg.src = 'One sided CI.png';
        infoText.textContent = 'A one-sided confidence interval puts the entire significance level α into one tail (the shaded rejection region), so you get just one bound at confidence 1−α instead of two. In the left-tailed / lower-bound case, the interval is [L, ∞), meaning “we’re 95% confident the true value is at least L,” which fits questions like “Is a lightbulb’s mean lifetime ≥ 10,000 hours?” In the right-tailed / upper-bound case, the interval is (−∞, U], meaning “we’re 95% confident the true value is no more than U,” which fits questions like “Is average pollution ≤ the safety threshold?” You use a one-tailed CI when only one direction matters (and you’re willing to ignore the other), and it lines up with a one-tailed test: if the spec/null value falls beyond your one-sided bound in the wrong direction, you’d reject at level α.';
      }
      infoModalBack.style.display = 'flex';
    }

    infoTwoOne.addEventListener('click', () => openInfo('twoone'));
    infoTail.addEventListener('click', () => openInfo('tail'));
    infoClose.addEventListener('click', () => (infoModalBack.style.display='none'));
    infoModalBack.addEventListener('click', (e) => { if(e.target === infoModalBack) infoModalBack.style.display='none'; });

    // ---------------------------
    // File upload + parsing
    // ---------------------------
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if(fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    ;['dragenter','dragover'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.add('ring-4','ring-emerald-100');
        dropZone.style.borderColor = 'var(--brand-primary)';
      });
    });
    ;['dragleave','drop'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.remove('ring-4','ring-emerald-100');
        dropZone.style.borderColor = '';
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const f = e.dataTransfer?.files?.[0];
      if(f) handleFile(f);
    });

    function detectDelimiter(line){
      const c = (line.match(/,/g)||[]).length;
      const t = (line.match(/\t/g)||[]).length;
      const s = (line.match(/;/g)||[]).length;
      const m = Math.max(c,t,s);
      if(m === t) return '\t';
      if(m === s) return ';';
      return ',';
    }

    function parseCSV(text, delim){
      const rows = [];
      let row = [];
      let cur = '';
      let inQuotes = false;
      for(let i=0;i<text.length;i++){
        const ch = text[i];
        const next = text[i+1];
        if(ch === '"'){
          if(inQuotes && next === '"'){
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if(!inQuotes && ch === delim){
          row.push(cur);
          cur = '';
        } else if(!inQuotes && (ch === '\n' || ch === '\r')){
          if(ch === '\r' && next === '\n') i++;
          row.push(cur);
          rows.push(row);
          row = [];
          cur = '';
        } else {
          cur += ch;
        }
      }
      if(cur.length || row.length){
        row.push(cur);
        rows.push(row);
      }
      while(rows.length && rows[rows.length-1].every(x => String(x).trim() === '')) rows.pop();
      return rows;
    }

    function looksLikeHeader(firstRow){
      if(!firstRow || !firstRow.length) return false;
      let nonNumeric = 0;
      let numeric = 0;
      for(const cell of firstRow){
        const t = String(cell ?? '').trim();
        if(!t) continue;
        const n = Number(t);
        if(Number.isFinite(n)) numeric++; else nonNumeric++;
      }
      return nonNumeric > 0 && nonNumeric >= numeric;
    }

    async function handleFile(file){
      const name = file.name || 'file';
      const ext = name.toLowerCase().split('.').pop();
      fileStatus.textContent = `Loaded: ${name}`;

      try{
        let rows;
        if(ext === 'csv' || ext === 'txt'){
          const text = await file.text();
          const firstLine = text.split(/\r?\n/)[0] ?? '';
          const delim = detectDelimiter(firstLine);
          rows = parseCSV(text, delim);
        } else if(ext === 'xlsx'){
          if(!window.XLSX){
            throw new Error('XLSX parser not available. Check your network connection (SheetJS CDN).');
          }
          const buf = await file.arrayBuffer();
          const wb = XLSX.read(buf, {type:'array'});
          const sheetName = wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(ws, {header:1, raw:false, defval:''});
        } else {
          throw new Error('Unsupported file type. Please upload .csv, .txt, or .xlsx.');
        }

        if(!rows || rows.length < 1) throw new Error('File appears empty.');

        const headerGuess = looksLikeHeader(rows[0]);
        state.parsedFile = { rows, headerGuess, filename: name };
        openColumnPicker();
      } catch(e){
        state.parsedFile = null;
        fileStatus.textContent = 'No file loaded.';
        alert(String(e.message || e));
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
        div.className = 'w-full';
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

      hasHeader.addEventListener('change', () => {
        openColumnPicker();
      }, { once: true });

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
      sidedToggle.checked = false; // two-sided
      tailToggle.checked = false; // left
      tailField.style.display = 'none';
      ccToggle.checked = false;

      syncConfidence();
      buildManualInputs();
      updateAssumptions();
      zPill.textContent = `Z-value: ${fmt(computeZ())}`;
    }
    init();
  
