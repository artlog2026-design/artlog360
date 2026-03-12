import { useState, useRef, useCallback, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — 부산은행 브랜드 컬러 시스템
═══════════════════════════════════════════════ */
const C = {
  navy:    "#004692",
  navyDk:  "#002D5F",
  navyLt:  "#1A6DB5",
  gold:    "#B8922A",
  goldLt:  "#D4A843",
  goldPale:"#FDF6E3",
  slate:   "#F0F5FC",
  white:   "#FFFFFF",
  ink:     "#0F1D2E",
  muted:   "#6B7A8D",
  border:  "#D6E3F2",
  success: "#0E7F5A",
  warn:    "#C47B16",
};

const FONT = "'BNK Gothic', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";

/* ═══════════════════════════════════════════════
   LOADING STEPS
═══════════════════════════════════════════════ */
const LOADING_STEPS = [
  { icon: "📡", text: "MORAK 학습 데이터 연동 중…" },
  { icon: "🧠", text: "AI 학습 패턴 분석 중…" },
  { icon: "📊", text: "인지·정서 발달 지표 산출 중…" },
  { icon: "🎨", text: "카드뉴스 슬라이드 생성 중…" },
  { icon: "✅", text: "리포트 완성!" },
];

/* ═══════════════════════════════════════════════
   CARD NEWS SLIDES (더미 데이터)
═══════════════════════════════════════════════ */
const buildSlides = (data) => [
  {
    bg: `linear-gradient(145deg, #EBF4FF 0%, #F5F0FF 100%)`,
    accent: C.navy,
    tag: "이달의 성장 스토리",
    title: `${data.studentName || "김지아"} 학생의\n빛나는 한 달`,
    body: `${data.pieces || "체르니 Op.299 · 소나티네"}\n꾸준한 연습이 만든 특별한 성장`,
    emoji: "🌟",
    sub: `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 · Artlog360`,
  },
  {
    bg: `linear-gradient(145deg, #FDF6E3 0%, #FEF9F0 100%)`,
    accent: C.gold,
    tag: "마스터 곡 포인트",
    title: `이달의 연주곡\n완전 정복!`,
    body: `${data.pieces || "체르니 Op.299"}\n리듬 안정성 ★★★★★\n음정 정확도 ★★★★☆\n표현력 ★★★★★`,
    emoji: "🎹",
    sub: "연습 누적 18회 · 총 540분",
  },
  {
    bg: `linear-gradient(145deg, #E8F8F2 0%, #F0FDF9 100%)`,
    accent: C.success,
    tag: "AI 학습 분석",
    title: `집중력 지수\n상위 12%`,
    body: `이번 달 몰입도 ${data.immersion || 8}점\n자세 교정 ${data.posture || 7}점\nAI 종합 평가: 매우 우수`,
    emoji: "📈",
    sub: "MORAK 데이터 연동 기반 분석",
  },
  {
    bg: `linear-gradient(145deg, #FFF0F5 0%, #FFF5F8 100%)`,
    accent: "#C0395A",
    tag: "원장님 메시지",
    title: `특별한 한 마디`,
    body: data.comment || "지아 학생의 리듬감이 이번 달 크게 향상되었습니다. 꾸준한 연습 태도와 집중력이 정말 인상적이에요. 앞으로가 더욱 기대됩니다! 🎵",
    emoji: "💌",
    sub: "하모니 피아노학원 원장 드림",
  },
  {
    bg: `linear-gradient(145deg, #EBF4FF 0%, #E8F0FC 100%)`,
    accent: C.navy,
    tag: "BNK 부산은행 × Artlog360",
    title: `꿈나무 적금\n우대금리 혜택`,
    body: `성장 리포트 발급 시\n연 0.5% 추가 우대금리\n소상공인 특별 대출 상담 무료 제공`,
    emoji: "🏦",
    sub: "BNK 부산은행 제휴 서비스",
  },
];

/* ═══════════════════════════════════════════════
   RADAR CHART DATA
═══════════════════════════════════════════════ */
const buildRadarData = (immersion, posture) => [
  { subject: "집중력",   A: Math.min(10, immersion + 0.5),   fullMark: 10 },
  { subject: "표현력",   A: Math.min(10, posture + 1),       fullMark: 10 },
  { subject: "이해도",   A: Math.min(10, (immersion + posture) / 2 + 0.5), fullMark: 10 },
  { subject: "성취도",   A: Math.min(10, immersion - 0.5),   fullMark: 10 },
  { subject: "창의성",   A: Math.min(10, posture + 0.5),     fullMark: 10 },
  { subject: "협동심",   A: Math.min(10, immersion - 1),     fullMark: 10 },
];

function ArtlogLogo() {
  return (
    <div style={{
      padding: "4px 10px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      fontSize: 14,
      fontWeight: 900,
      lineHeight: 1,
      color: C.white,
      letterSpacing: "-0.2px",
      fontFamily: FONT,
    }}>
      Artlog<span style={{ color: C.goldLt }}>360</span>
    </div>
  );
}

function BNKLogo() {
  return (
    <div style={{
      padding: "4px 10px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      display: "flex",
      alignItems: "center",
      gap: 7,
      color: C.white,
      fontFamily: FONT,
    }}>
      <span style={{
        width: 16,
        height: 16,
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldLt})`,
        color: C.navyDk,
        fontSize: 10,
        fontWeight: 900,
        lineHeight: 1,
      }}>B</span>
      <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "-0.2px" }}>부산은행</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HELPER COMPONENTS
═══════════════════════════════════════════════ */
function NavBar({ step, onBack }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200,
      background: C.navyDk,
      borderBottom: `2px solid ${C.gold}`,
      padding: "0 28px",
      height: 58,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 4px 20px rgba(0,46,95,0.35)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ArtlogLogo />
        <span style={{ color: "#7FA8D4", fontSize: 12, fontWeight: 800 }}>×</span>
        <BNKLogo />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: step >= n ? `linear-gradient(135deg, ${C.gold}, ${C.goldLt})` : "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800,
              color: step >= n ? C.navyDk : "#7FA8D4",
              transition: "all 0.4s",
            }}>{n}</div>
            {n < 3 && <div style={{ width: 20, height: 1, background: step > n ? C.goldLt : "rgba(255,255,255,0.15)" }} />}
          </div>
        ))}
        <div style={{ marginLeft: 8, fontSize: 12, color: "#7FA8D4", fontWeight: 600 }}>
          {step === 1 ? "입력" : step === 2 ? "리포트" : "카드뉴스"}
        </div>
        {step > 1 && (
          <button onClick={onBack} style={{
            marginLeft: 12, padding: "5px 14px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)", color: "#fff",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>← 다시 입력</button>
        )}
      </div>
    </nav>
  );
}

function GoldDivider() {
  return <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "24px 0", opacity: 0.5 }} />;
}

function Badge({ children, color = C.navy }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 11px", borderRadius: 20,
      background: color + "18", color: color,
      fontSize: 11, fontWeight: 800,
      border: `1px solid ${color}44`,
      letterSpacing: 0.4,
    }}>{children}</span>
  );
}

function ScoreBar({ label, value, max = 10, color = C.navy }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 900, color }}>{value}/{max}</span>
      </div>
      <div style={{ height: 7, background: "#E2ECF5", borderRadius: 10, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 10,
          background: `linear-gradient(90deg, ${color}, ${color}BB)`,
          width: `${(value / max) * 100}%`,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 1 — INPUT DASHBOARD
═══════════════════════════════════════════════ */
function InputDashboard({ form, setForm, photoPreview, setPhotoPreview, onSubmit }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const valid = form.studentName.trim().length > 0;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 20px 80px", fontFamily: FONT }}>
      {/* Page Title */}
      <div style={{ marginBottom: 32, borderLeft: `4px solid ${C.gold}`, paddingLeft: 16 }}>
        <Badge color={C.gold}>Step 01</Badge>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.navyDk, margin: "8px 0 4px", letterSpacing: "-0.6px" }}>
          원장님 전용 입력 대시보드
        </h1>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
          학생 정보와 이달의 학습 데이터를 입력하면 AI가 전문 리포트를 즉시 생성합니다.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Photo Upload */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Card>
            <SectionLabel icon="📷" text="연주 사진 업로드" />
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
              style={{
                marginTop: 14,
                border: `2px dashed ${dragOver ? C.gold : C.border}`,
                borderRadius: 14, background: dragOver ? C.goldPale : C.slate,
                minHeight: 160, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                transition: "all 0.2s", overflow: "hidden",
              }}
            >
              {photoPreview ? (
                <div style={{ position: "relative", width: "100%", textAlign: "center", padding: 12 }}>
                  <img src={photoPreview} alt="preview" style={{ maxHeight: 220, borderRadius: 12, maxWidth: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", top: 18, right: 18,
                    background: C.navy, color: "#fff",
                    borderRadius: 8, fontSize: 11, padding: "4px 12px", fontWeight: 800,
                  }}>사진 변경</div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 44, marginBottom: 10 }}>🖼️</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navyDk }}>드래그 앤 드롭 또는 클릭</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>JPG · PNG · WEBP 지원</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])} />
          </Card>
        </div>

        {/* Student Info */}
        <Card>
          <SectionLabel icon="👤" text="학생 정보" />
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <FormField label="학생 이름 *">
              <input value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                placeholder="예: 김지아" style={inputSt} />
            </FormField>
            <FormField label="이달의 학습 곡명">
              <input value={form.pieces} onChange={e => setForm(f => ({ ...f, pieces: e.target.value }))}
                placeholder="예: 체르니 Op.299, 소나티네" style={inputSt} />
            </FormField>
            {/* MORAK Toggle */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: 10,
              background: form.morak ? "#EAF5EA" : C.slate,
              border: `1px solid ${form.morak ? "#A8D5A8" : C.border}`,
              transition: "all 0.3s",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>📡 MORAK 데이터 연동</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>연습 기록 자동 수집 · AI 신뢰도 향상</div>
              </div>
              <div onClick={() => setForm(f => ({ ...f, morak: !f.morak }))} style={{
                width: 46, height: 26, borderRadius: 13, cursor: "pointer",
                background: form.morak ? C.success : "#CBD5E0",
                position: "relative", transition: "background 0.3s",
              }}>
                <div style={{
                  position: "absolute", top: 3,
                  left: form.morak ? 22 : 3,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#fff", transition: "left 0.3s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Scores */}
        <Card>
          <SectionLabel icon="📊" text="학습 평가 점수" />
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 20 }}>
            <SliderInput label="학습 몰입도" value={form.immersion}
              onChange={v => setForm(f => ({ ...f, immersion: v }))} color={C.navy} />
            <SliderInput label="자세 교정 점수" value={form.posture}
              onChange={v => setForm(f => ({ ...f, posture: v }))} color={C.gold} />
          </div>
        </Card>

        {/* Comment */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Card>
            <SectionLabel icon="💬" text="원장님 핵심 메모" />
            <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              rows={3} placeholder="예: 이번 달 지아 학생은 리듬감이 크게 향상되었으며, 왼손 독립 연습에서 놀라운 집중력을 보여주었습니다."
              style={{ ...inputSt, resize: "vertical", marginTop: 12, lineHeight: 1.8 }} />
          </Card>
        </div>

        {/* CTA */}
        <div style={{ gridColumn: "1 / -1" }}>
          <button onClick={onSubmit} disabled={!valid} style={{
            width: "100%", padding: "20px",
            borderRadius: 16, border: "none",
            background: valid
              ? `linear-gradient(135deg, ${C.navyDk} 0%, ${C.navy} 60%, ${C.navyLt} 100%)`
              : "#CBD5E0",
            color: valid ? "#fff" : "#94A3B8",
            fontSize: 18, fontWeight: 900,
            cursor: valid ? "pointer" : "not-allowed",
            boxShadow: valid ? `0 8px 32px rgba(0,70,146,0.4)` : "none",
            letterSpacing: "-0.3px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            transition: "all 0.2s", fontFamily: FONT,
          }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            AI 분석 및 리포트 생성
            <span style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 10,
              background: "rgba(255,255,255,0.2)", fontWeight: 700,
            }}>Artlog360 Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════ */
function LoadingScreen({ step: loadStep }) {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(160deg, ${C.navyDk} 0%, ${C.navy} 50%, #0A5BA0 100%)`,
      fontFamily: FONT,
    }}>
      <div style={{ textAlign: "center", color: C.white, padding: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 20, animation: "pulse 1.5s ease-in-out infinite" }}>⚙️</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px" }}>AI 분석 엔진 가동 중</h2>
        <p style={{ color: "#7FA8D4", fontSize: 14, margin: "0 0 36px" }}>잠시만 기다려 주세요…</p>

        <div style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          borderRadius: 18, padding: "28px 40px",
          border: "1px solid rgba(255,255,255,0.12)",
          minWidth: 340, textAlign: "left",
        }}>
          {LOADING_STEPS.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "10px 0",
              borderBottom: i < LOADING_STEPS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              opacity: i <= loadStep ? 1 : 0.2,
              transition: "opacity 0.5s ease",
            }}>
              <span style={{ fontSize: 20, minWidth: 28, textAlign: "center" }}>
                {i < loadStep ? "✅" : i === loadStep ? s.icon : "○"}
              </span>
              <span style={{ fontSize: 14, fontWeight: i <= loadStep ? 700 : 400, color: i <= loadStep ? "#fff" : "#7FA8D4" }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, background: "rgba(255,255,255,0.1)", borderRadius: 10, height: 8, overflow: "hidden", width: 340 }}>
          <div style={{
            height: "100%", borderRadius: 10,
            background: `linear-gradient(90deg, ${C.goldLt}, ${C.gold})`,
            width: `${(loadStep / (LOADING_STEPS.length - 1)) * 100}%`,
            transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#7FA8D4" }}>
          {Math.round((loadStep / (LOADING_STEPS.length - 1)) * 100)}% 완료
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:rotate(0deg)}50%{transform:rotate(180deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 2 — AI REPORT (A4 Portrait Style)
═══════════════════════════════════════════════ */
function AIReport({ form, photoPreview, onNext }) {
  const radarData = buildRadarData(form.immersion, form.posture);
  const avg = ((form.immersion + form.posture) / 2).toFixed(1);
  const month = `${new Date().getMonth() + 1}`;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 20px 80px", fontFamily: FONT }}>

      {/* Page Title */}
      <div style={{ marginBottom: 28, borderLeft: `4px solid ${C.gold}`, paddingLeft: 16 }}>
        <Badge color={C.gold}>Step 02</Badge>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.navyDk, margin: "8px 0 4px", letterSpacing: "-0.6px" }}>
          AI 정밀 학습 리포트
        </h1>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>학부모 알림톡 발송 전 미리보기</p>
      </div>

      {/* A4 Card */}
      <div style={{
        background: C.white, borderRadius: 20,
        boxShadow: "0 8px 48px rgba(0,46,95,0.14)",
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>

        {/* Report Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.navyDk} 0%, ${C.navy} 65%, ${C.navyLt} 100%)`,
          padding: "32px 36px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", right: 40, bottom: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(184,146,42,0.12)" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, position: "relative" }}>
            {photoPreview ? (
              <img src={photoPreview} alt="student" style={{
                width: 88, height: 88, borderRadius: 16, objectFit: "cover",
                border: `3px solid ${C.goldLt}`, flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 88, height: 88, borderRadius: 16, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLt})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
              }}>🎹</div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.goldLt, fontWeight: 700, letterSpacing: 1.2, marginBottom: 6 }}>
                ARTLOG360 × BNK 부산은행 — AI 정밀 학습 리포트
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.white, letterSpacing: "-0.8px", lineHeight: 1.2 }}>
                {form.studentName || "김지아"} 학생의<br />
                <span style={{ color: C.goldLt }}>{month}월의 성장 기록</span>
              </div>
              <div style={{ fontSize: 13, color: "#90B8D8", marginTop: 8 }}>
                {form.pieces || "체르니 Op.299 · 소나티네 Op.36"} · {new Date().getFullYear()}년 {month}월
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {["집중력 우수", "꾸준한 성장", "리듬감 향상"].map((t, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 700,
                    background: "rgba(184,146,42,0.2)", color: C.goldLt,
                    padding: "3px 10px", borderRadius: 10, border: "1px solid rgba(212,168,67,0.35)",
                  }}>#{t}</span>
                ))}
                {form.morak && (
                  <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(14,127,90,0.25)", color: "#6EDCB6", padding: "3px 10px", borderRadius: 10, border: "1px solid rgba(14,127,90,0.35)" }}>
                    📡 MORAK 연동
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#90B8D8", marginBottom: 4 }}>종합 점수</div>
              <div style={{
                fontSize: 48, fontWeight: 900, color: C.goldLt, lineHeight: 1,
                textShadow: `0 0 20px rgba(212,168,67,0.5)`,
              }}>{avg}</div>
              <div style={{
                fontSize: 12, marginTop: 4, background: "rgba(184,146,42,0.2)",
                color: C.goldLt, padding: "3px 12px", borderRadius: 10,
                border: "1px solid rgba(212,168,67,0.3)", fontWeight: 700,
              }}>
                {avg >= 8 ? "최우수" : avg >= 6 ? "우수" : "양호"}
              </div>
            </div>
          </div>
        </div>

        {/* Gold stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${C.navyDk}, ${C.gold}, ${C.navyLt})` }} />

        {/* Body */}
        <div style={{ padding: "32px 36px" }}>

          {/* Score bars + Radar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
            <div>
              <ReportSection title="📊 학습 평가 지표" />
              <div style={{ marginTop: 14 }}>
                <ScoreBar label="학습 몰입도" value={form.immersion} color={C.navy} />
                <ScoreBar label="자세 교정 점수" value={form.posture} color={C.gold} />
                <ScoreBar label="연습 일관성" value={Math.min(10, form.immersion - 0.5)} color={C.navyLt} />
                <ScoreBar label="표현력 발전" value={Math.min(10, form.posture + 0.5)} color="#0E7F5A" />
              </div>
            </div>
            <div>
              <ReportSection title="🧠 인지·정서 발달 레이더" />
              <div style={{ height: 200, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: C.muted, fontWeight: 700 }} />
                    <Radar name="학생" dataKey="A" stroke={C.navy} fill={C.navy} fillOpacity={0.18} strokeWidth={2} dot={{ r: 3, fill: C.navy }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <GoldDivider />

          {/* AI Analysis */}
          <div style={{ marginBottom: 28 }}>
            <ReportSection title="🤖 AI 정밀 분석 리포트" badge="Artlog360 Engine" />
            <div style={{
              marginTop: 14, padding: "22px 24px",
              background: C.slate, borderRadius: 14,
              borderLeft: `4px solid ${C.navy}`,
              border: `1px solid ${C.border}`, borderLeftWidth: 4,
            }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.95, color: C.ink }}>
                <strong style={{ color: C.navy }}>{form.studentName || "학생"}</strong> 학생은 이번 달{" "}
                <strong>{form.pieces || "연습곡"}</strong>을 중심으로 체계적인 학습을 성공적으로 완수하였습니다.
                AI 분석 결과, 학습 몰입도 <strong style={{ color: C.navy }}>{form.immersion}점</strong>과 자세 교정{" "}
                <strong style={{ color: C.gold }}>{form.posture}점</strong>을 기록하며 종합 <strong>{avg}점</strong>의
                {parseFloat(avg) >= 8 ? " 최우수" : parseFloat(avg) >= 6 ? " 우수" : " 양호한"} 성취를 보였습니다.
                특히 <strong>리듬 안정성과 음정 정확도</strong>에서 전월 대비 약 15% 향상이 관찰되었으며,
                박자 일관성 지표에서 상위 12%에 해당하는 집중력을 발휘하였습니다.
                다음 달에는 <strong>다이나믹 표현(강약 조절)</strong> 및 <strong>왼손 독립성 강화</strong>에
                집중 학습을 권장합니다.
                {form.morak && " MORAK 연동 데이터를 통해 가정 연습 패턴도 안정적으로 확인되었습니다."}
              </p>
            </div>
          </div>

          {/* Strengths / Goals */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            <TagSection
              title="✨ 이달의 강점" color={C.success} bg="#F0FDF7" border="#A8E6CF"
              tags={["리듬감 향상", "꾸준한 출석", "집중력 우수", "악보 독보력", "성실한 태도"]}
            />
            <TagSection
              title="🎯 다음 달 성장 목표" color={C.navy} bg={C.slate} border={C.border}
              tags={["다이나믹 표현", "왼손 독립성", "페달 활용법", "암보 연습", "무대 준비"]}
            />
          </div>

          {/* Photo Gallery */}
          {photoPreview && (
            <>
              <GoldDivider />
              <div style={{ marginBottom: 28 }}>
                <ReportSection title="🖼️ 이달의 예술적 순간" />
                <div style={{
                  marginTop: 14, borderRadius: 16, overflow: "hidden",
                  position: "relative", background: C.navyDk,
                }}>
                  <img src={photoPreview} alt="moment" style={{
                    width: "100%", maxHeight: 280, objectFit: "cover", opacity: 0.85,
                  }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(to top, rgba(0,30,60,0.9), transparent)",
                    padding: "20px 24px",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: C.goldLt, marginBottom: 4 }}>
                      "음악이 흐르는 순간, 모든 것이 빛납니다."
                    </div>
                    <div style={{ fontSize: 12, color: "#90B8D8" }}>
                      {form.studentName || "학생"} · {form.pieces || "연습곡"} · {new Date().getFullYear()}년 {month}월
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Teacher Comment */}
          {form.comment && (
            <>
              <GoldDivider />
              <div style={{ marginBottom: 28 }}>
                <ReportSection title="💬 원장님 핵심 메모" />
                <div style={{
                  marginTop: 14, padding: "20px 24px",
                  background: C.goldPale, borderRadius: 14,
                  border: `1px solid #E8D5A3`,
                  display: "flex", gap: 14, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>👩‍🏫</span>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.85, color: C.ink, fontStyle: "italic" }}>
                    "{form.comment}"
                  </p>
                </div>
              </div>
            </>
          )}

          <GoldDivider />

          {/* BNK Section */}
          <div style={{
            background: `linear-gradient(135deg, ${C.navyDk}, ${C.navy})`,
            borderRadius: 16, padding: "24px 28px", marginBottom: 28, color: C.white,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <BNKLogo />
              <span style={{ color: "#7FA8D4", fontSize: 12, fontWeight: 800 }}>×</span>
              <ArtlogLogo />
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: C.goldLt, letterSpacing: 0.5 }}>
                  BNK 부산은행 전용 섹션
                </div>
                <div style={{ fontSize: 11, color: "#90B8D8" }}>Artlog360 제휴 금융 혜택</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { icon: "💎", label: "BNK 꿈나무 적금", value: "연 0.5%", sub: "우대 금리 쿠폰 발급" },
                { icon: "📋", label: "소상공인 대출 상담", value: "무료", sub: "전용 창구 우선 배정" },
                { icon: "🎁", label: "리포트 발급 리워드", value: "+2,000P", sub: "BNK 포인트 적립" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.1)", borderRadius: 12,
                  padding: "16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, color: "#90B8D8", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.goldLt }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: "#7FA8D4", marginTop: 4 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center", padding: "16px 0 4px",
            borderTop: `1px solid ${C.border}`,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 18px", borderRadius: 20,
              border: `1px solid ${C.gold}55`,
              background: C.goldPale,
            }}>
              <span style={{ fontSize: 14 }}>🛡️</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.gold, letterSpacing: 0.5 }}>
                Artlog360 AI Engine — 인증 리포트
              </span>
              <span style={{ fontSize: 10, color: C.muted }}>|</span>
              <span style={{ fontSize: 11, color: C.muted }}>
                {new Date().toLocaleDateString("ko-KR")} 발급
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next CTA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
        <button style={{
          padding: "16px", borderRadius: 14, border: `2px solid ${C.navy}`,
          background: "transparent", color: C.navy, fontSize: 15, fontWeight: 800,
          cursor: "pointer", fontFamily: FONT,
        }}>
          📲 학부모 알림톡 발송
        </button>
        <button onClick={onNext} style={{
          padding: "16px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLt})`,
          color: C.navyDk, fontSize: 15, fontWeight: 900,
          cursor: "pointer", fontFamily: FONT,
          boxShadow: `0 6px 24px rgba(184,146,42,0.35)`,
        }}>
          🎨 홍보용 카드뉴스 보기 →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STEP 3 — CARD NEWS SLIDER
═══════════════════════════════════════════════ */
function CardNews({ form, photoPreview }) {
  const [idx, setIdx] = useState(0);
  const slides = buildSlides({ ...form, photoPreview });
  const slide = slides[idx];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "36px 20px 80px", fontFamily: FONT }}>
      {/* Title */}
      <div style={{ marginBottom: 28, borderLeft: `4px solid ${C.gold}`, paddingLeft: 16 }}>
        <Badge color={C.gold}>Step 03</Badge>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.navyDk, margin: "8px 0 4px", letterSpacing: "-0.6px" }}>
          홍보용 카드뉴스
        </h1>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>인스타그램 · 카카오채널 공유용 1:1 슬라이드</p>
      </div>

      {/* Slide Counter */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 28 : 8, height: 8, borderRadius: 4,
            background: i === idx ? C.navy : C.border,
            cursor: "pointer", transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Slide Card (1:1 square) */}
      <div style={{
        width: "100%", paddingBottom: "100%",
        position: "relative", borderRadius: 24, overflow: "hidden",
        boxShadow: "0 16px 64px rgba(0,46,95,0.2)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: slide.bg,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 36px", textAlign: "center",
        }}>
          {/* Top tag */}
          <div style={{
            position: "absolute", top: 24, left: 24,
            fontSize: 11, fontWeight: 800, letterSpacing: 0.8,
            color: slide.accent, background: slide.accent + "15",
            padding: "5px 14px", borderRadius: 20,
            border: `1px solid ${slide.accent}33`,
          }}>{slide.tag}</div>

          {/* Slide number */}
          <div style={{
            position: "absolute", top: 24, right: 24,
            fontSize: 12, fontWeight: 800, color: C.muted,
          }}>{idx + 1} / {slides.length}</div>

          {/* Main emoji */}
          <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>{slide.emoji}</div>

          {/* Title */}
          <h2 style={{
            fontSize: 26, fontWeight: 900, color: slide.accent,
            margin: "0 0 16px", letterSpacing: "-0.6px", lineHeight: 1.35,
            whiteSpace: "pre-line",
          }}>{slide.title}</h2>

          {/* Body */}
          <p style={{
            fontSize: 14, color: C.muted, lineHeight: 1.9, margin: 0,
            whiteSpace: "pre-line", fontWeight: 500,
          }}>{slide.body}</p>

          {/* Bottom bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 4, background: `linear-gradient(90deg, ${C.navyDk}, ${C.gold}, ${C.navyLt})`,
          }} />

          {/* Artlog watermark */}
          <div style={{
            position: "absolute", bottom: 16,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🎹</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.muted, letterSpacing: 0.5 }}>
              Artlog360
            </span>
            <span style={{ fontSize: 10, color: C.border }}>×</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>BNK 부산은행</span>
          </div>

          <div style={{ position: "absolute", bottom: 36, fontSize: 11, color: C.border }}>{slide.sub}</div>
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} style={{
          flex: 1, padding: "14px", borderRadius: 12, border: `2px solid ${C.border}`,
          background: "transparent", color: idx === 0 ? C.border : C.navy,
          fontSize: 15, fontWeight: 800, cursor: idx === 0 ? "not-allowed" : "pointer",
          fontFamily: FONT, transition: "all 0.2s",
        }}>← 이전</button>
        <button onClick={() => setIdx(i => Math.min(slides.length - 1, i + 1))} disabled={idx === slides.length - 1} style={{
          flex: 1, padding: "14px", borderRadius: 12, border: "none",
          background: idx === slides.length - 1 ? C.border
            : `linear-gradient(135deg, ${C.navyDk}, ${C.navy})`,
          color: idx === slides.length - 1 ? C.muted : "#fff",
          fontSize: 15, fontWeight: 800,
          cursor: idx === slides.length - 1 ? "not-allowed" : "pointer",
          fontFamily: FONT, transition: "all 0.2s",
          boxShadow: idx === slides.length - 1 ? "none" : `0 4px 16px rgba(0,70,146,0.3)`,
        }}>다음 →</button>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {["📱 인스타그램 공유", "💬 카카오채널 게시", "📥 이미지 저장"].map((label, i) => (
          <button key={i} style={{
            padding: "10px 8px", borderRadius: 10,
            border: `1px solid ${C.border}`, background: C.slate,
            color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer",
            fontFamily: FONT,
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SMALL HELPER COMPONENTS
═══════════════════════════════════════════════ */
function Card({ children }) {
  return (
    <div style={{
      background: C.white, borderRadius: 16,
      padding: "22px", boxShadow: "0 2px 16px rgba(0,70,146,0.07)",
      border: `1px solid ${C.border}`,
    }}>{children}</div>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 900, color: C.ink, letterSpacing: "-0.2px" }}>{text}</span>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function SliderInput({ label, value, onChange, color }) {
  const meta = value >= 9 ? "최상" : value >= 7 ? "우수" : value >= 5 ? "보통" : "노력 필요";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 900, color, background: color + "15", padding: "1px 10px", borderRadius: 8 }}>
          {value}점 · {meta}
        </span>
      </div>
      <input type="range" min={1} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, height: 6, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 3 }}>
        <span>1 노력 필요</span><span>10 최상</span>
      </div>
    </div>
  );
}

function ReportSection({ title, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 900, color: C.ink }}>{title}</span>
      {badge && <Badge color={C.gold}>{badge}</Badge>}
    </div>
  );
}

function TagSection({ title, tags, color, bg, border }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: "18px 20px", border: `1px solid ${border}` }}>
      <div style={{ fontSize: 13, fontWeight: 900, color, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {tags.map((t, i) => (
          <span key={i} style={{
            fontSize: 12, fontWeight: 700, color,
            background: C.white, padding: "4px 12px",
            borderRadius: 10, border: `1px solid ${border}`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

const inputSt = {
  width: "100%", padding: "11px 14px",
  borderRadius: 10, border: `1.5px solid ${C.border}`,
  fontSize: 14, color: C.ink, outline: "none",
  background: C.slate, boxSizing: "border-box",
  fontFamily: FONT, transition: "border-color 0.2s",
};

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState("input");   // input | loading | report | cardnews
  const [loadStep, setLoadStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    studentName: "", pieces: "", immersion: 8, posture: 7, comment: "", morak: true,
  });

  const uiStep = phase === "input" ? 1 : phase === "loading" ? 1 : phase === "report" ? 2 : 3;

  const startAnalysis = () => {
    setPhase("loading");
    setLoadStep(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setLoadStep(s);
      if (s >= LOADING_STEPS.length - 1) {
        clearInterval(iv);
        setTimeout(() => setPhase("report"), 600);
      }
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.slate, fontFamily: FONT }}>
      <NavBar step={uiStep} onBack={() => setPhase("input")} />

      {phase === "input" && (
        <InputDashboard
          form={form} setForm={setForm}
          photoPreview={photoPreview} setPhotoPreview={setPhotoPreview}
          onSubmit={startAnalysis}
        />
      )}
      {phase === "loading" && <LoadingScreen step={loadStep} />}
      {phase === "report" && (
        <AIReport form={form} photoPreview={photoPreview} onNext={() => setPhase("cardnews")} />
      )}
      {phase === "cardnews" && (
        <CardNews form={form} photoPreview={photoPreview} />
      )}
    </div>
  );
}
// [1. 네비게이션 바 로고 이미지 교체]
