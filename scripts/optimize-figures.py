"""figures/fig-*.svg 의 path 데이터를 줄인다.

글자가 path로 바뀐 Excalidraw 스타일 그림은 path 좌표가 용량의 대부분이다.
1. 좌표를 소수 한 자리로 반올림한다. viewBox 1단위가 화면에서 1px 안팎이라 눈에 띄지 않는다.
2. 절대 좌표 명령(M L H V Q C)을 상대 좌표(m l h v q c)로 바꾼다.
   반올림한 절대 좌표의 차이를 0.1 단위 정수로 계산하므로 오차가 쌓이지 않는다.
이미 상대 좌표인 path는 건드리지 않으므로 여러 번 실행해도 된다.

사용: python3 scripts/optimize-figures.py [파일 ...]   (인자가 없으면 전체)
"""
import glob
import re
import sys

TOKEN = re.compile(r'[MLHVQCZmlhvqcz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?')
ARGC = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'Q': 4, 'C': 6, 'Z': 0}


def tenths(s):
    return round(float(s) * 10)


def num(t):
    """0.1 단위 정수를 가장 짧은 문자열로."""
    sign = '-' if t < 0 else ''
    q, r = divmod(abs(t), 10)
    if r == 0:
        return f'{sign}{q}'
    return f'{sign}{q if q else ""}.{r}'


def join(nums):
    out = ''
    for s in nums:
        if out and not s.startswith('-'):
            out += ' '
        out += s
    return out


def to_relative(d):
    toks = TOKEN.findall(d)
    if any(t in 'mlhvqcz' for t in toks if t.isalpha()):
        return None  # 이미 상대 좌표가 섞여 있으면 그대로 둔다
    out = []
    cx = cy = sx = sy = 0
    i, cmd, first = 0, None, True
    while i < len(toks):
        if toks[i].isalpha():
            cmd = toks[i].upper()
            i += 1
            if cmd == 'Z':
                out.append('z')
                cx, cy = sx, sy
                continue
        n = ARGC[cmd]
        args = [tenths(a) for a in toks[i:i + n]]
        i += n
        if cmd == 'H':
            rel = [args[0] - cx]
            cx = args[0]
        elif cmd == 'V':
            rel = [args[0] - cy]
            cy = args[0]
        else:
            rel = [a - (cx if k % 2 == 0 else cy) for k, a in enumerate(args)]
            cx, cy = args[-2], args[-1]
        if cmd == 'M':
            if first:
                rel = args
            sx, sy = cx, cy
        letter = 'M' if (cmd == 'M' and first) else cmd.lower()
        first = False
        out.append(letter + join([num(v) for v in rel]))
        if cmd == 'M':
            cmd = 'L'  # M 뒤에 이어지는 좌표쌍은 L
    return ''.join(out)


def shrink(m):
    rel = to_relative(m.group(1))
    return m.group(0) if rel is None else f'd="{rel}"'


paths = sys.argv[1:] or glob.glob('src/content/posts/*/figures/fig-*.svg')
before = after = 0
for p in paths:
    src = open(p, encoding='utf-8').read()
    out = re.sub(r'd="([^"]*)"', shrink, src)
    before += len(src.encode())
    after += len(out.encode())
    if out != src:
        open(p, 'w', encoding='utf-8').write(out)
print(f'{len(paths)} files: {before:,} -> {after:,} bytes')
