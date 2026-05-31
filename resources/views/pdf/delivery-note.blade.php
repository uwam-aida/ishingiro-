<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: Arial, sans-serif;
    font-size: 10.5px;
    color: #000;
    background: #fff;
    padding: 28px 32px;
  }

  /* ── HEADER ───────────────────────────────────────── */
  .header { text-align: center; margin-bottom: 10px; }

  .logo {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: #666;
    margin: 0 auto 7px auto;
  }

  .company-name {
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 0.4px;
    margin-bottom: 3px;
  }

  .company-info {
    font-size: 8.5px;
    line-height: 1.65;
    color: #222;
  }

  hr { border: none; border-top: 1px solid #000; margin: 10px 0; }

  /* ── TITLE ────────────────────────────────────────── */
  .title {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .meta {
    text-align: center;
    font-size: 9.5px;
    margin-bottom: 12px;
  }

  .meta u { font-weight: bold; }

  /* ── RECIPIENT ────────────────────────────────────── */
  .recipient {
    font-size: 10px;
    margin-bottom: 11px;
  }

  /* ── TABLE ────────────────────────────────────────── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4px;
  }

  th, td {
    border: 1px solid #000;
    padding: 5px 7px;
    font-size: 10px;
  }

  th { font-weight: bold; }

  .c-name  { width: 46%; }
  .c-qty   { width: 11%; text-align: center; }
  .c-price { width: 22%; text-align: right; }
  .c-total { width: 21%; text-align: right; font-weight: bold; }

  .total-label {
    text-align: right;
    font-weight: bold;
    border: 1px solid #000;
    padding: 5px 7px;
    font-size: 10px;
  }

  .total-value {
    text-align: right;
    font-weight: bold;
    border: 1px solid #000;
    padding: 5px 7px;
    font-size: 10px;
  }

  /* ── SIGNATURES ───────────────────────────────────── */
  .sig-row {
    width: 100%;
    margin-top: 22px;
    margin-bottom: 6px;
  }

  /* Use a table for the two-column layout — DomPDF handles tables reliably */
  .sig-table { width: 100%; border: none; }
  .sig-table td { border: none; padding: 0; vertical-align: top; }

  .sig-label {
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .sig-line {
    border-bottom: 1px solid #000;
    margin-top: 24px;
    width: 85%;
  }

  .sig-right { text-align: right; }
  .sig-right .sig-line { margin-left: auto; }

  .goods-note {
    font-style: italic;
    font-size: 9px;
    color: #444;
    margin-top: 8px;
  }

  .motto {
    text-align: center;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 0.2px;
    margin-top: 22px;
    color: #111;
  }
</style>
</head>
<body>

  {{-- HEADER --}}
  <div class="header">
    <div class="logo"></div>
    <div class="company-name">BINYA LTD</div>
    <div class="company-info">
      B.P:2558 KIGALI RWANDA<br>
      TEL:(+250)786766202/072577025<br>
      TIN: 102806807<br>
      email:ishingiro.naphtal@gmail.com
    </div>
  </div>

  <hr>

  {{-- DOCUMENT TITLE --}}
  <div class="title">DELIVERY NOTE / PACKING LIST</div>
  <div class="meta">
    DATE: &nbsp;<u>{{ $date }}</u> &nbsp;&nbsp;&nbsp; TIME: &nbsp;<u>{{ $time }}</u>
  </div>

  {{-- RECIPIENT --}}
  <div class="recipient">
    <strong>CUSTOM NAME:</strong> &nbsp;&nbsp; {{ $recipient }}
  </div>

  {{-- ITEMS TABLE --}}
  <table>
    <thead>
      <tr>
        <th class="c-name">ITEM NAME</th>
        <th class="c-qty">QTY</th>
        <th class="c-price">UNIT PRICE</th>
        <th class="c-total">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($items as $item)
      <tr>
        {{-- Support both 'name' and 'product_name' keys --}}
        <td class="c-name">{{ strtoupper($item['name'] ?? $item['product_name'] ?? 'Unknown') }}</td>
        {{-- Support both 'qty' and 'quantity' keys --}}
        <td class="c-qty">{{ $item['qty'] ?? $item['quantity'] ?? 0 }}</td>
        <td class="c-price">{{ number_format($item['unit_price'] ?? 0) }}</td>
        <td class="c-total">{{ number_format($item['total'] ?? 0) }}</td>
      </tr>
      @endforeach

      {{-- TOTAL ROW --}}
      <tr>
        <td colspan="3" class="total-label">TOTAL AMOUNT</td>
        <td class="total-value">{{ number_format($grand_total ?? 0) }}</td>
      </tr>
    </tbody>
  </table>

  {{-- SIGNATURES --}}
  <table class="sig-table" style="margin-top:22px;">
    <tr>
      <td style="width:50%;">
        <div class="sig-label">RECEIVER SIGNATURE</div>
        <div class="sig-line"></div>
      </td>
      <td style="width:50%; text-align:right;">
        <div class="sig-label" style="text-align:right;">AUTHORIZED SIGNATURE</div>
        <div class="sig-line" style="margin-left:auto;"></div>
      </td>
    </tr>
  </table>

  <div class="goods-note">goods Received in good condition</div>

  <div class="motto">GUTEKEREZA NEZA NO GUKORA NEZA NIBWO BUTWARI.</div>

</body>
</html>