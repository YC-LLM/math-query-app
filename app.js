(function () {
  const raw = [
    ...MATH_QUERY_DATA,
    ...(typeof MATH_QUERY_DATA_REAL !== 'undefined' ? MATH_QUERY_DATA_REAL : []),
    ...(typeof MATH_QUERY_DATA_MOE !== 'undefined' ? MATH_QUERY_DATA_MOE : []),
  ];

  // Normalize every record shape (demo/real_data's mathScreen+mathCount vs
  // mathsys's mathSubjects) into two derived sets so filtering logic doesn't
  // need to branch on where the record came from.
  const data = raw.map((r) => {
    const screenSubjects = new Set(r.mathScreen ? [r.mathScreen.subject] : []);
    const countSubjects = new Set([
      ...(r.mathCount ? [r.mathCount.subject] : []),
      ...(r.mathSubjects || []),
    ]);
    const weighted = !!(r.mathCount && r.mathCount.weight > 1);
    return { ...r, _screen: screenSubjects, _count: countSubjects, _weighted: weighted };
  });

  const state = {
    keyword: '',
    subjects: new Set(),
    usage: 'any',
    channels: new Set(['繁星推薦', '個人申請', '考試分發']),
    group: '',
    region: '',
    type: '',
    year: '',
  };

  const el = {
    keyword: document.getElementById('f-keyword'),
    subjectRow: document.getElementById('f-subject'),
    usage: document.getElementById('f-usage'),
    channelBox: document.getElementById('f-channel'),
    group: document.getElementById('f-group'),
    region: document.getElementById('f-region'),
    type: document.getElementById('f-type'),
    year: document.getElementById('f-year'),
    reset: document.getElementById('f-reset'),
    list: document.getElementById('results-list'),
    summary: document.getElementById('results-summary'),
    dataCount: document.getElementById('data-count'),
  };

  function populateSelect(selectEl, values) {
    [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'zh-Hant')).forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }
  populateSelect(el.group, data.map((d) => d.group));
  populateSelect(el.region, data.map((d) => d.region));
  populateSelect(el.year, data.map((d) => d.year).map((y) => (y ? `${y}學年度` : null)));

  function passesSubject(record) {
    if (state.subjects.size === 0) return true;
    for (const s of state.subjects) {
      if (record._screen.has(s) || record._count.has(s)) return true;
    }
    return false;
  }

  function passesUsage(record) {
    switch (state.usage) {
      case 'any': return true;
      case 'has': return record._screen.size > 0 || record._count.size > 0;
      case 'screen': return record._screen.size > 0;
      case 'count': return record._count.size > 0;
      case 'weighted': return record._weighted;
      default: return true;
    }
  }

  function passesKeyword(record) {
    if (!state.keyword) return true;
    const kw = state.keyword.trim().toLowerCase();
    return (record.school + record.dept).toLowerCase().includes(kw);
  }

  function filterData() {
    return data.filter((r) =>
      passesKeyword(r) &&
      state.channels.has(r.channel) &&
      (state.group === '' || r.group === state.group) &&
      (state.region === '' || r.region === state.region) &&
      (state.type === '' || r.type === state.type) &&
      (state.year === '' || r.year === state.year) &&
      passesSubject(r) &&
      passesUsage(r)
    );
  }

  function mathPillsHTML(record) {
    const pills = [];
    if (record.mathScreen) {
      pills.push(`<span class="pill screen">檢定 ${record.mathScreen.subject}・${record.mathScreen.min}</span>`);
    }
    if (record.mathCount) {
      const weighted = record.mathCount.weight > 1;
      pills.push(`<span class="pill count${weighted ? ' weighted' : ''}">採計 ${record.mathCount.subject}・×${record.mathCount.weight}</span>`);
    }
    if (record.mathSubjects && record.mathSubjects.length) {
      record.mathSubjects.forEach((s) => {
        pills.push(`<span class="pill count">採計 ${s}</span>`);
      });
    }
    if (pills.length === 0) {
      pills.push('<span class="pill none">不參採數學</span>');
    }
    return pills.join('');
  }

  function sourceBadgeHTML(record) {
    if (record.source && record.source.startsWith('official')) {
      return `<span class="tag source-official">✅ 官方${record.year}學年度</span>`;
    }
    return `<span class="tag source-demo">⚠️ 示範資料</span>`;
  }

  function noteHTML(record) {
    if (!record.participationNote) return '';
    return `<p class="card-note">官方原文：${record.participationNote}（無加權倍率資料）</p>`;
  }

  function renderCard(record) {
    const quotaHTML = record.quota ? `<span class="tag">核定名額 ${record.quota}</span>` : '';
    return `
      <article class="card">
        <div class="card-top">
          <div class="card-title">
            <span class="card-school">${record.school}</span>
            <span class="card-dept">${record.dept}</span>
          </div>
          <div class="tag-row">
            <span class="tag channel">${record.channel}</span>
            <span class="tag">${record.type}・${record.region}</span>
            <span class="tag">${record.group}</span>
            ${quotaHTML}
            ${sourceBadgeHTML(record)}
          </div>
        </div>
        <div class="math-row">${mathPillsHTML(record)}</div>
        ${noteHTML(record)}
      </article>
    `;
  }

  function render() {
    const results = filterData();
    el.list.innerHTML = results.length
      ? results.map(renderCard).join('')
      : `<div class="empty-state"><span class="emoji">🔍</span>找不到符合條件的校系，試著放寬篩選條件看看。</div>`;
    el.summary.innerHTML = `共 <strong>${results.length}</strong> / ${data.length} 筆符合條件`;
  }

  el.keyword.addEventListener('input', (e) => {
    state.keyword = e.target.value;
    render();
  });

  el.subjectRow.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const v = chip.dataset.value;
      if (state.subjects.has(v)) {
        state.subjects.delete(v);
        chip.classList.remove('active');
      } else {
        state.subjects.add(v);
        chip.classList.add('active');
      }
      render();
    });
  });

  el.usage.addEventListener('change', (e) => {
    state.usage = e.target.value;
    render();
  });

  el.channelBox.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.checked) state.channels.add(cb.value);
      else state.channels.delete(cb.value);
      render();
    });
  });

  el.group.addEventListener('change', (e) => { state.group = e.target.value; render(); });
  el.region.addEventListener('change', (e) => { state.region = e.target.value; render(); });
  el.type.addEventListener('change', (e) => { state.type = e.target.value; render(); });
  el.year.addEventListener('change', (e) => {
    state.year = e.target.value.replace('學年度', '');
    render();
  });

  el.reset.addEventListener('click', () => {
    state.keyword = '';
    state.subjects.clear();
    state.usage = 'any';
    state.channels = new Set(['繁星推薦', '個人申請', '考試分發']);
    state.group = '';
    state.region = '';
    state.type = '';
    state.year = '';

    el.keyword.value = '';
    el.subjectRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    el.usage.querySelector('input[value="any"]').checked = true;
    el.channelBox.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = true));
    el.group.value = '';
    el.region.value = '';
    el.type.value = '';
    el.year.value = '';

    render();
  });

  el.dataCount.textContent = data.length;
  render();
})();
